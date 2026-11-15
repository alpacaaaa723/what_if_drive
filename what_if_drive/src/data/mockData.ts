import type { DriveRoute, MoodOption, DurationOption } from '../types';

export const MOOD_OPTIONS: MoodOption[] = [
  { id: 'sea', label: '바다', icon: '🌊' },
  { id: 'mountain', label: '산과 숲', icon: '🌲' },
  { id: 'night', label: '야경', icon: '🌃' },
  { id: 'cafe', label: '감성 카페', icon: '☕' },
  { id: 'quiet', label: '한적한 드라이브', icon: '🛣️' },
];

export const DURATION_OPTIONS: DurationOption[] = [
  { id: '1h', label: '1시간', minutes: 60 },
  { id: '2h', label: '2시간', minutes: 120 },
  { id: '3h', label: '3시간', minutes: 180 },
  { id: 'free', label: '자유 시간', minutes: null },
];

export const MOCK_ROUTES: DriveRoute[] = [
  // ── 바다 ──────────────────────────────────────────────────────────
  {
    id: 'route-sea-1',
    name: '해안을 따라가는 저녁 드라이브',
    tagline: '일몰 시간에 맞춰 달리는 해안 코스',
    mood: 'sea',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    totalDuration: '약 1시간 50분',
    totalDistance: '52km',
    departure: '현재 위치',
    destination: '강릉 경포해변',
    waypoints: [
      {
        name: '정동진 해돋이공원',
        description: '바다를 바라보며 잠시 쉬어가는 전망 포인트',
        duration: '약 15분',
        type: 'scenic',
      },
      {
        name: '안목해변 카페거리',
        description: '커피 한 잔과 함께 바다를 감상할 수 있는 거리',
        duration: '약 20분',
        type: 'cafe',
      },
      {
        name: '경포대 전망대',
        description: '경포호와 바다를 동시에 내려다볼 수 있는 전망대',
        duration: '약 10분',
        type: 'scenic',
      },
    ],
    reason: '지금 시간대에 일몰이 가장 아름답게 보이는 해안 코스입니다. 정동진에서 경포까지 이어지는 7번 국도는 차창 밖으로 바다가 계속 펼쳐집니다.',
    highlights: ['7번 국도 해안 뷰', '일몰 전망', '커피 한 잔'],
    difficulty: 'easy',
  },
  {
    id: 'route-sea-2',
    name: '남해 미조항 해안 루트',
    tagline: '굽이굽이 이어지는 남해 바닷길',
    mood: 'sea',
    imageUrl: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80',
    totalDuration: '약 2시간 20분',
    totalDistance: '71km',
    departure: '현재 위치',
    destination: '남해 미조항',
    waypoints: [
      {
        name: '창선교 전망 포인트',
        description: '다리와 바다가 어우러진 풍경을 감상하는 곳',
        duration: '약 10분',
        type: 'scenic',
      },
      {
        name: '독일마을 전망대',
        description: '이국적인 풍경과 남해 전경을 한눈에 담는 전망대',
        duration: '약 20분',
        type: 'landmark',
      },
      {
        name: '미조 항구',
        description: '작은 어촌 항구에서 느끼는 소박한 바다의 정취',
        duration: '약 15분',
        type: 'rest',
      },
    ],
    reason: '남해의 굽이지는 해안도로를 따라 달리며 이국적인 풍경을 즐길 수 있는 코스입니다. 독일마을에서 보이는 남해의 풍경은 특히 인상적입니다.',
    highlights: ['해안 드라이브', '독일마을', '어촌 풍경'],
    difficulty: 'scenic',
  },
  {
    id: 'route-sea-3',
    name: '서해 낙조 드라이브',
    tagline: '붉게 물드는 서해 노을을 달리며',
    mood: 'sea',
    imageUrl: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=800&q=80',
    totalDuration: '약 1시간 30분',
    totalDistance: '44km',
    departure: '현재 위치',
    destination: '충남 대천해수욕장',
    waypoints: [
      {
        name: '무창포 해수욕장',
        description: '서해의 넓은 갯벌과 바다가 펼쳐지는 조용한 해변',
        duration: '약 15분',
        type: 'scenic',
      },
      {
        name: '천북 굴단지',
        description: '서해 명물 굴구이로 유명한 먹거리 거리',
        duration: '약 20분',
        type: 'rest',
      },
      {
        name: '대천 해변 전망대',
        description: '서해 낙조를 가장 아름답게 감상할 수 있는 포인트',
        duration: '약 15분',
        type: 'scenic',
      },
    ],
    reason: '지금 이 시간, 서해의 낙조는 하루 중 가장 붉게 타오릅니다. 무창포에서 대천까지 이어지는 서해안 도로는 드넓은 바다를 가까이서 느낄 수 있습니다.',
    highlights: ['서해 낙조', '굴 맛집', '넓은 갯벌'],
    difficulty: 'easy',
  },

  // ── 산과 숲 ──────────────────────────────────────────────────────
  {
    id: 'route-mountain-1',
    name: '산 속 고요한 숲길 코스',
    tagline: '차창으로 스며드는 초록빛 숲',
    mood: 'mountain',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80',
    totalDuration: '약 2시간 10분',
    totalDistance: '61km',
    departure: '현재 위치',
    destination: '오대산 국립공원',
    waypoints: [
      {
        name: '대관령 양떼목장',
        description: '초원과 산 능선이 어우러진 목장 전망',
        duration: '약 20분',
        type: 'scenic',
      },
      {
        name: '선자령 풍력단지',
        description: '풍력발전기와 탁 트인 하늘이 조화를 이루는 곳',
        duration: '약 15분',
        type: 'scenic',
      },
      {
        name: '월정사 전나무 숲길',
        description: '수백 년 된 전나무들이 늘어선 고요한 숲길',
        duration: '약 20분',
        type: 'landmark',
      },
    ],
    reason: '도심에서 벗어나 자연의 고요함을 느낄 수 있는 코스입니다. 대관령에서 오대산까지 이어지는 길은 사계절 모두 아름답습니다.',
    highlights: ['전나무 숲길', '능선 드라이브', '자연 휴식'],
    difficulty: 'scenic',
  },
  {
    id: 'route-mountain-2',
    name: '지리산 화개장터 단풍 코스',
    tagline: '섬진강을 따라 이어지는 숲길',
    mood: 'mountain',
    imageUrl: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80',
    totalDuration: '약 2시간 40분',
    totalDistance: '78km',
    departure: '현재 위치',
    destination: '화개장터',
    waypoints: [
      {
        name: '쌍계사 십리벚꽃길',
        description: '봄철 벚꽃, 가을철 단풍으로 유명한 드라이브 명소',
        duration: '약 20분',
        type: 'scenic',
      },
      {
        name: '최참판댁 마을',
        description: '소설 토지의 배경이 된 고즈넉한 전통마을',
        duration: '약 20분',
        type: 'landmark',
      },
      {
        name: '섬진강 뷰포인트',
        description: '산과 강이 어우러진 절경을 한눈에 담는 곳',
        duration: '약 15분',
        type: 'scenic',
      },
    ],
    reason: '섬진강을 따라 이어지는 19번 국도는 사계절 내내 아름다운 드라이브 코스입니다. 지리산 자락의 고요함과 섬진강의 흐름이 함께합니다.',
    highlights: ['섬진강 드라이브', '벚꽃/단풍길', '전통마을'],
    difficulty: 'scenic',
  },
  {
    id: 'route-mountain-3',
    name: '설악산 미시령 고갯길',
    tagline: '구름 위를 달리는 고원 드라이브',
    mood: 'mountain',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    totalDuration: '약 1시간 45분',
    totalDistance: '49km',
    departure: '현재 위치',
    destination: '속초 설악산 케이블카',
    waypoints: [
      {
        name: '미시령 옛길 전망대',
        description: '동해와 설악산 능선을 동시에 볼 수 있는 전망 포인트',
        duration: '약 15분',
        type: 'scenic',
      },
      {
        name: '울산바위 전망 포인트',
        description: '설악산 대표 명소 울산바위를 가장 가까이 볼 수 있는 곳',
        duration: '약 10분',
        type: 'scenic',
      },
      {
        name: '권금성 케이블카 승강장',
        description: '케이블카를 타고 설악산 정상의 풍경을 감상하는 곳',
        duration: '약 30분',
        type: 'landmark',
      },
    ],
    reason: '미시령 고갯길은 한국에서 가장 극적인 드라이브 코스 중 하나입니다. 굽이치는 산길을 오르며 동해와 설악산 능선을 한눈에 담을 수 있습니다.',
    highlights: ['고원 드라이브', '동해 전망', '설악산 능선'],
    difficulty: 'moderate',
  },

  // ── 야경 ──────────────────────────────────────────────────────────
  {
    id: 'route-night-1',
    name: '도심 야경 드라이브',
    tagline: '불빛이 가득한 밤의 도시를 달리다',
    mood: 'night',
    imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80',
    totalDuration: '약 1시간 30분',
    totalDistance: '38km',
    departure: '현재 위치',
    destination: '남산 N서울타워',
    waypoints: [
      {
        name: '한강 반포대교',
        description: '달빛 아래 반짝이는 한강과 무지개분수',
        duration: '약 15분',
        type: 'scenic',
      },
      {
        name: '이태원 경리단길',
        description: '늦은 밤에도 활기찬 이태원의 불빛',
        duration: '약 10분',
        type: 'rest',
      },
      {
        name: 'N서울타워 전망대',
        description: '서울 야경을 360도로 감상할 수 있는 전망대',
        duration: '약 30분',
        type: 'landmark',
      },
    ],
    reason: '지금 이 시간, 도시의 불빛이 가장 선명하게 빛납니다. 한강변을 따라 달리다 남산까지 이어지는 코스는 서울의 밤을 가장 잘 보여줍니다.',
    highlights: ['한강 야경', 'N타워 전망', '도심 불빛'],
    difficulty: 'easy',
  },
  {
    id: 'route-night-2',
    name: '인천 야경 항구 드라이브',
    tagline: '항구의 불빛과 바다가 만나는 밤',
    mood: 'night',
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
    totalDuration: '약 1시간 20분',
    totalDistance: '31km',
    departure: '현재 위치',
    destination: '인천 송도 센트럴파크',
    waypoints: [
      {
        name: '인천대교 야간 드라이브',
        description: '21.4km의 국내 최장 사장교를 밤에 달리는 특별한 경험',
        duration: '약 20분',
        type: 'scenic',
      },
      {
        name: '연안부두 야경',
        description: '인천 항구와 여객선의 불빛이 반짝이는 항구 풍경',
        duration: '약 15분',
        type: 'scenic',
      },
      {
        name: '송도 트리플스트리트',
        description: '야경이 아름다운 송도의 대표 쇼핑·문화 복합공간',
        duration: '약 20분',
        type: 'rest',
      },
    ],
    reason: '인천대교 야경과 항구의 불빛은 서울 근교에서 경험할 수 있는 최고의 야경 드라이브 코스입니다. 바다와 도시의 불빛이 함께합니다.',
    highlights: ['인천대교', '항구 야경', '송도 도심'],
    difficulty: 'easy',
  },
  {
    id: 'route-night-3',
    name: '부산 광안리 야경 코스',
    tagline: '광안대교의 조명이 바다에 녹아드는 밤',
    mood: 'night',
    imageUrl: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80',
    totalDuration: '약 1시간 10분',
    totalDistance: '28km',
    departure: '현재 위치',
    destination: '이기대 해안 전망대',
    waypoints: [
      {
        name: '광안리 해변',
        description: '광안대교를 배경으로 펼쳐지는 부산의 대표 야경',
        duration: '약 20분',
        type: 'scenic',
      },
      {
        name: '해운대 달맞이 고개',
        description: '달빛과 바다가 어우러지는 부산의 로맨틱 드라이브 코스',
        duration: '약 15분',
        type: 'scenic',
      },
      {
        name: '이기대 해안 전망대',
        description: '부산 도심 야경과 바다를 함께 조망하는 전망대',
        duration: '약 15분',
        type: 'scenic',
      },
    ],
    reason: '광안대교와 해운대 달맞이 고개를 연결하는 이 코스는 부산에서 가장 아름다운 야경을 선사합니다. 바다와 도심의 불빛이 만나는 특별한 밤입니다.',
    highlights: ['광안대교', '달맞이 고개', '해안 전망'],
    difficulty: 'easy',
  },

  // ── 감성 카페 ─────────────────────────────────────────────────────
  {
    id: 'route-cafe-1',
    name: '경기 양평 감성 카페 투어',
    tagline: '강변과 숲 사이의 힐링 카페 드라이브',
    mood: 'cafe',
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
    totalDuration: '약 2시간',
    totalDistance: '58km',
    departure: '현재 위치',
    destination: '양평 두물머리',
    waypoints: [
      {
        name: '북한강 뷰 카페',
        description: '북한강을 바라보며 여유로운 커피 타임을 즐기는 곳',
        duration: '약 30분',
        type: 'cafe',
      },
      {
        name: '문호리 리버마켓',
        description: '아기자기한 소품과 커피가 있는 강변 마켓',
        duration: '약 20분',
        type: 'rest',
      },
      {
        name: '두물머리 카페 거리',
        description: '양수리 두물머리 주변의 감성적인 카페 모음',
        duration: '약 30분',
        type: 'cafe',
      },
    ],
    reason: '북한강을 따라 이어지는 양평 카페 거리는 주말 드라이브의 완벽한 목적지입니다. 경치 좋은 카페에서 커피 한 잔의 여유를 즐겨보세요.',
    highlights: ['북한강 뷰', '감성 카페', '두물머리'],
    difficulty: 'easy',
  },
  {
    id: 'route-cafe-2',
    name: '제주 협재해변 카페 로드',
    tagline: '에메랄드 바다를 품은 카페 드라이브',
    mood: 'cafe',
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80',
    totalDuration: '약 1시간 40분',
    totalDistance: '46km',
    departure: '현재 위치',
    destination: '애월 카페 거리',
    waypoints: [
      {
        name: '협재해변 뷰 카페',
        description: '에메랄드빛 협재해변을 바라보며 마시는 커피',
        duration: '약 30분',
        type: 'cafe',
      },
      {
        name: '한담해안산책로',
        description: '돌담길과 바다가 어우러진 제주의 감성 산책로',
        duration: '약 20분',
        type: 'scenic',
      },
      {
        name: '애월 항구 카페 거리',
        description: '제주의 대표 카페 거리, 감성적인 카페들이 즐비한 곳',
        duration: '약 30분',
        type: 'cafe',
      },
    ],
    reason: '제주 서쪽 해안을 따라 이어지는 이 코스는 아름다운 바다 전망과 감성적인 카페를 동시에 즐길 수 있습니다. 제주 카페 드라이브의 정수입니다.',
    highlights: ['협재해변', '돌담길', '애월 카페'],
    difficulty: 'easy',
  },
  {
    id: 'route-cafe-3',
    name: '가평 자라섬 카페 투어',
    tagline: '호수와 가을 단풍 속 카페 여행',
    mood: 'cafe',
    imageUrl: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80',
    totalDuration: '약 1시간 50분',
    totalDistance: '53km',
    departure: '현재 위치',
    destination: '가평 자라섬',
    waypoints: [
      {
        name: '아침고요수목원 카페',
        description: '아름다운 정원 속에 자리한 클래식한 분위기의 카페',
        duration: '약 30분',
        type: 'cafe',
      },
      {
        name: '청평호 뷰 카페',
        description: '청평호를 바라보며 즐기는 여유로운 커피 타임',
        duration: '약 25분',
        type: 'cafe',
      },
      {
        name: '가평 레일파크 카페거리',
        description: '철길 옆 감성 카페들이 늘어선 독특한 거리',
        duration: '약 20분',
        type: 'cafe',
      },
    ],
    reason: '경춘국도를 따라 이어지는 가평 카페 로드는 수도권에서 가장 인기 있는 드라이브 코스 중 하나입니다. 호수와 자연 속에서 카페 여행을 즐기세요.',
    highlights: ['청평호 뷰', '수목원 카페', '자라섬'],
    difficulty: 'easy',
  },

  // ── 한적한 드라이브 ───────────────────────────────────────────────
  {
    id: 'route-quiet-1',
    name: '태안 해안 국립공원 한적 코스',
    tagline: '비워진 도로에서 찾는 고요한 드라이브',
    mood: 'quiet',
    imageUrl: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80',
    totalDuration: '약 2시간 30분',
    totalDistance: '68km',
    departure: '현재 위치',
    destination: '만리포해수욕장',
    waypoints: [
      {
        name: '천리포수목원',
        description: '사계절 아름다운 식물과 조용한 산책로가 있는 수목원',
        duration: '약 20분',
        type: 'scenic',
      },
      {
        name: '몽산포 해변',
        description: '사람이 많지 않아 한적하고 조용한 소박한 해변',
        duration: '약 15분',
        type: 'scenic',
      },
      {
        name: '만리포 전망대',
        description: '서해를 바라보며 혼자만의 시간을 보낼 수 있는 조용한 전망대',
        duration: '약 15분',
        type: 'scenic',
      },
    ],
    reason: '태안 해안 국립공원을 따라 이어지는 이 코스는 번잡함에서 벗어나 혼자만의 조용한 드라이브를 즐기기에 완벽합니다. 비워진 도로에서 여유를 찾아보세요.',
    highlights: ['한적한 도로', '조용한 해변', '수목원'],
    difficulty: 'easy',
  },
  {
    id: 'route-quiet-2',
    name: '강화도 평화누리 한적 드라이브',
    tagline: '역사와 자연이 공존하는 조용한 길',
    mood: 'quiet',
    imageUrl: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80',
    totalDuration: '약 1시간 45분',
    totalDistance: '47km',
    departure: '현재 위치',
    destination: '강화도 외포항',
    waypoints: [
      {
        name: '강화 고려산 진달래 능선',
        description: '계절마다 다른 모습을 보여주는 고려산 능선 드라이브',
        duration: '약 20분',
        type: 'scenic',
      },
      {
        name: '전등사 소나무 숲길',
        description: '고찰 전등사 주변의 조용한 소나무 숲길',
        duration: '약 15분',
        type: 'landmark',
      },
      {
        name: '동막해변',
        description: '강화도 남쪽의 넓고 한적한 해변과 갯벌',
        duration: '약 15분',
        type: 'scenic',
      },
    ],
    reason: '강화도의 한적한 도로들은 복잡한 일상에서 벗어나 조용한 드라이브를 즐기기 최적입니다. 고려 시대 역사의 흔적과 자연이 공존하는 고요한 길입니다.',
    highlights: ['한적한 길', '고찰 소나무숲', '강화 갯벌'],
    difficulty: 'easy',
  },
  {
    id: 'route-quiet-3',
    name: '경주 역사 유적지 야간 코스',
    tagline: '천 년 고도의 고요한 밤 드라이브',
    mood: 'quiet',
    imageUrl: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800&q=80',
    totalDuration: '약 1시간 20분',
    totalDistance: '34km',
    departure: '현재 위치',
    destination: '불국사',
    waypoints: [
      {
        name: '대릉원 고분군',
        description: '신라 왕릉이 모여 있는 광활한 고분 공원, 야간에 더욱 고요한 곳',
        duration: '약 15분',
        type: 'landmark',
      },
      {
        name: '교촌마을 한옥 거리',
        description: '전통 한옥이 늘어선 조용하고 아름다운 거리',
        duration: '약 15분',
        type: 'landmark',
      },
      {
        name: '석굴암 가는 산길',
        description: '불국사에서 석굴암으로 이어지는 조용한 산 드라이브',
        duration: '약 20분',
        type: 'scenic',
      },
    ],
    reason: '경주의 한적한 밤 도로에서 천 년 역사의 고요함을 느낄 수 있는 코스입니다. 대릉원의 고분군 옆을 지나는 드라이브는 특별한 경험입니다.',
    highlights: ['고분군 야경', '한옥 거리', '산 드라이브'],
    difficulty: 'easy',
  },
];

/**
 * 선택한 mood에 맞는 추천 코스 3개를 반환한다.
 * mood가 없으면 각 mood에서 1개씩 선택해 다양성을 보장한다.
 */
export function getRecommendedRoutes(mood: string | null, _duration: string | null): DriveRoute[] {
  if (mood) {
    const matched = MOCK_ROUTES.filter(r => r.mood === mood);
    // 같은 mood 코스가 3개 이상이면 앞에서 3개
    if (matched.length >= 3) return matched.slice(0, 3);
    // 부족하면 다른 mood에서 보충
    const others = MOCK_ROUTES.filter(r => r.mood !== mood);
    return [...matched, ...others].slice(0, 3);
  }
  // mood 미선택: sea/mountain/night에서 각 1개
  const picks: DriveRoute[] = [];
  const moods = ['sea', 'mountain', 'night'];
  for (const m of moods) {
    const found = MOCK_ROUTES.find(r => r.mood === m);
    if (found) picks.push(found);
  }
  return picks;
}
