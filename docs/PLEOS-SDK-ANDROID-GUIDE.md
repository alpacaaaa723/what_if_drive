# Pleos SDK Android 연동 참고

별도 Android Studio 프로젝트는 [`android/`](../android/)에 있습니다. 이 문서의 코드는 이전에 작성된 참고 스니펫이며, 현재 공개된 NaviHelper SDK 버전의 API 시그니처나 권한을 검증한 구현 코드가 아닙니다.

> **중요:** 이 파일의 Kotlin 코드는 **Android Automotive OS** 환경에서만 동작합니다.
> 실제 NaviHelper 호출 전 Playground의 현재 버전 문서와 승인된 API 권한을 확인하세요. Android 앱 프로토타입은 NaviHelper SDK 호출을 아직 하지 않습니다.

---

## 1. 의존성 설정 (build.gradle.kts)

```kotlin
repositories {
    maven("https://nexus-playground.pleos.ai/repository/maven-releases/")
    google()
    mavenCentral()
}

dependencies {
    // FusedLocation SDK
    implementation("ai.pleos.playground:FusedLocation:1.1.3")
    
    // NaviHelper SDK (Maven 메타데이터에서 확인한 릴리스)
    implementation("ai.pleos.playground:NaviHelper:3.0.5")
    
    // 현재 앱 범위에는 필요하지 않음. 사용할 때만 추가
    // implementation("ai.pleos.playground:Vehicle:2.3.2")
}
```

## 2. AndroidManifest.xml 권한 선언

```xml
<!-- FusedLocation SDK -->
<uses-permission android:name="pleos.car.permission.FUSED_LOCATION" />

<!-- Vehicle SDK (DrivingMode, Odometer) -->
<uses-permission android:name="pleos.car.permission.CAR_DRIVE" />

<!-- 공식 문서에서 확인한 NaviHelper 권한만 선언할 것 -->
```

## 3. FusedLocation SDK 연동

```kotlin
import ai.pleos.playground.location.fused.FusedLocation
import ai.pleos.playground.location.fused.listener.FusedLocationListener
import ai.pleos.playground.location.fused.model.LocationData

class WhatIfDriveActivity : CarAppActivity() {

    private lateinit var fusedLocation: FusedLocation
    
    private val locationListener = object : FusedLocationListener {
        override fun onChanged(locationData: LocationData?) {
            locationData?.let {
                // WebView JavaScript Bridge로 위치 전달
                val json = """{"lat":${it.latitude},"lng":${it.longitude},"address":"${it.address}"}"""
                webView.evaluateJavascript("window.onPleosLocationUpdate('$json')", null)
            }
        }
        override fun onError(exception: Exception) {
            webView.evaluateJavascript("window.onPleosLocationError('${exception.message}')", null)
        }
    }
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        fusedLocation = FusedLocation(this)
        
        if (fusedLocation.isSupported()) {
            fusedLocation.initialize()
            fusedLocation.registerFusedLocationCallback(locationListener)
        } else {
            fusedLocation.showLocationAccessBlockedPopup()
        }
        
        setupWebView()
    }
    
    override fun onDestroy() {
        super.onDestroy()
        fusedLocation.unregisterFusedLocationCallback(locationListener)
        fusedLocation.release()
    }
}
```

## 4. NaviHelper SDK 연동 (WebView Bridge)

```kotlin
import ai.pleos.playground.navi.NaviHelper
import ai.pleos.playground.navi.model.RouteInfo
import ai.pleos.playground.navi.model.RequestWaypointInfo
import ai.pleos.playground.navi.model.WaypointIndex
import ai.pleos.playground.navi.model.RouteWithWaypointsRequest

class PleosNaviBridgeImpl(
    private val context: Context,
    private val naviHelper: NaviHelper
) {

    // JavaScript에서 호출: window.PleosNaviBridge.requestRouteWithWaypoints(json)
    @JavascriptInterface
    fun requestRouteWithWaypoints(routeJson: String) {
        try {
            val data = JSONObject(routeJson)
            val destObj = data.getJSONObject("destination")
            val waypointsArr = data.getJSONArray("waypoints")
            
            val destination = RouteInfo(
                latitude = destObj.getDouble("latitude"),
                longitude = destObj.getDouble("longitude"),
                poiName = destObj.getString("poiName"),
                address = destObj.getString("address")
            )
            
            val waypoints = (0 until waypointsArr.length()).map { i ->
                val wp = waypointsArr.getJSONObject(i)
                RequestWaypointInfo(
                    latitude = wp.getDouble("latitude"),
                    longitude = wp.getDouble("longitude"),
                    waypointIndex = if (wp.getInt("waypointIndex") == 0) 
                        WaypointIndex.FIRST else WaypointIndex.SECOND,
                    poiName = wp.getString("poiName"),
                    address = wp.getString("address")
                )
            }
            
            naviHelper.requestRouteWithWaypoints(
                RouteWithWaypointsRequest(
                    destination = destination,
                    waypoints = waypoints
                )
            )
        } catch (e: Exception) {
            Log.e("PleosNaviBridge", "requestRouteWithWaypoints 실패", e)
        }
    }
    
    @JavascriptInterface
    fun addWaypoint(waypointJson: String) {
        val wp = JSONObject(waypointJson)
        naviHelper.addWaypoint(
            RequestWaypointInfo(
                latitude = wp.getDouble("latitude"),
                longitude = wp.getDouble("longitude"),
                waypointIndex = if (wp.getInt("waypointIndex") == 0)
                    WaypointIndex.FIRST else WaypointIndex.SECOND,
                poiName = wp.getString("poiName"),
                address = wp.getString("address")
            )
        )
    }
    
    @JavascriptInterface
    fun removeWaypoint(index: Int) {
        naviHelper.removeWaypoint(
            if (index == 0) WaypointIndex.FIRST else WaypointIndex.SECOND
        )
    }
    
    @JavascriptInterface
    fun cancelRoute() {
        naviHelper.cancelRoute()
    }
}
```

## 5. Vehicle SDK 연동 (차속 + 주행 모드)

```kotlin
import ai.pleos.playground.vehicle.api.Vehicle
import android.car.Car
import android.car.hardware.CarPropertyManager
import android.car.VehiclePropertyIds

class PleosVehicleBridgeImpl(
    private val context: Context,
    private val webView: WebView
) {
    private val vehicle = Vehicle(context)
    private lateinit var carPropertyManager: CarPropertyManager
    
    // 차량 속도: CarPropertyManager (AAOS 표준)
    @JavascriptInterface
    fun getSpeed(): Float {
        return try {
            // PERF_VEHICLE_SPEED: m/s → km/h 변환
            carPropertyManager.getFloatProperty(
                VehiclePropertyIds.PERF_VEHICLE_SPEED, 0
            ) * 3.6f
        } catch (e: Exception) { 0f }
    }
    
    // 주행 모드: Pleos Vehicle SDK
    @JavascriptInterface
    fun getDrivingMode(): String {
        return try {
            vehicle.getDrivingMode()
                .getCurrentDrivingModeState()
                .toString() // "PARKED", "DRIVING", etc.
        } catch (e: Exception) { "UNKNOWN" }
    }
    
    // 주행 거리: Pleos Vehicle SDK Odometer
    @JavascriptInterface  
    fun getOdometer(): Float {
        return try {
            vehicle.getOdometer()
                .getTripCurrentDrivingDistance()
        } catch (e: Exception) { 0f }
    }
}
```

## 6. WebView 설정

```kotlin
private fun setupWebView() {
    webView.settings.apply {
        javaScriptEnabled = true
        domStorageEnabled = true
    }
    
    // Bridge 주입
    webView.addJavascriptInterface(
        PleosNaviBridgeImpl(this, naviHelper),
        "PleosNaviBridge"
    )
    webView.addJavascriptInterface(
        PleosVehicleBridgeImpl(this, webView),
        "PleosVehicleBridge"
    )
    
    // FusedLocation은 콜백으로 WebView에 푸시
    // window.PleosLocationBridge는 FusedLocation 초기화 후 주입
    
    // 로컬 번들 로드 (배포 시 assets/index.html)
    webView.loadUrl("file:///android_asset/index.html")
}
```

---

## 연동 흐름 요약

```
[React WebView]                    [Android Native]
       │                                  │
       │  window.PleosNaviBridge          │
       │  .requestRouteWithWaypoints() ──▶│ naviHelper.requestRouteWithWaypoints()
       │                                  │       ↓
       │                                  │  [Pleos 내비게이션 화면 전환]
       │                                  │
       │  window.PleosVehicleBridge       │
       │  .getSpeed()              ──────▶│ CarPropertyManager.PERF_VEHICLE_SPEED
       │                                  │
       │◀── onPleosLocationUpdate(json) ──│ FusedLocation.onChanged()
```
