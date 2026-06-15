export interface RecipeSample {
  id: string;
  sourceKind: 'link' | 'voice-transcript';
  sourceText: string;
  recipeName: string;
  serving: string;
  time: string;
  ingredients: string[];
  steps: string[];
  tips: string[];
  reviewNeeded: string[];
}

export interface RecipeCard {
  sourceTypeLabel: string;
  sourceText: string;
  recipeName: string;
  serving: string;
  time: string;
  ingredients: string[];
  steps: string[];
  tips: string[];
  reviewNeeded: string[];
  demoNotice: string;
}

export const recipeSamples: RecipeSample[] = [
  {
    id: 'mom-kimchi-jjigae',
    sourceKind: 'voice-transcript',
    sourceText: '엄마가 음성으로 말한 느낌: 김치는 푹 익은 걸로 두 컵 정도 넣고 돼지고기는 먼저 볶아. 국물은 쌀뜨물 있으면 좋고, 간은 김치 국물로 먼저 맞춘 다음 부족하면 국간장을 조금만 넣어.',
    recipeName: '엄마 김치찌개',
    serving: '2~3인분',
    time: '30분',
    ingredients: ['잘 익은 김치 2컵', '돼지고기 앞다리살 200g', '김치 국물 1/2컵', '쌀뜨물 또는 물 600ml', '두부 1/2모', '대파 1대', '국간장 1작은술'],
    steps: ['돼지고기를 냄비에 넣고 겉면이 익을 때까지 볶는다.', '김치를 먼저 볶아 신맛을 부드럽게 만든다.', '김치 국물과 쌀뜨물을 붓고 중불에서 18~20분 끓인다.', '두부와 대파를 넣고 5분 더 끓인 뒤 간을 조절한다.'],
    tips: ['김치가 너무 시면 설탕을 아주 조금만 넣어 균형을 맞춘다.', '돼지고기 기름이 부족하면 들기름 1작은술을 추가한다.'],
    reviewNeeded: ['김치 염도에 따라 국간장 양을 줄이거나 생략해야 한다.', '아이와 함께 먹는다면 고춧가루 추가 여부를 확인한다.'],
  },
  {
    id: 'doenjang-jjigae',
    sourceKind: 'link',
    sourceText: '블로그 링크 메모 느낌: 멸치육수를 내고 된장은 체에 풀면 텁텁함이 줄어든다. 애호박, 감자, 양파를 먼저 넣고 마지막에 두부와 청양고추를 넣는다.',
    recipeName: '구수한 된장찌개',
    serving: '2인분',
    time: '25분',
    ingredients: ['된장 2큰술', '멸치육수 600ml', '두부 1/2모', '애호박 1/3개', '감자 1개', '양파 1/2개', '청양고추 1개'],
    steps: ['멸치육수를 끓이고 된장을 체에 풀어 넣는다.', '감자와 양파를 먼저 넣어 8분 끓인다.', '애호박과 두부를 넣고 7분 더 끓인다.', '청양고추를 마지막에 넣고 향을 살린다.'],
    tips: ['된장을 오래 끓이면 향이 약해질 수 있어 중불을 유지한다.'],
    reviewNeeded: ['된장 브랜드별 염도가 달라 물 양 조절이 필요하다.', '매운맛을 원하지 않으면 청양고추를 제외한다.'],
  },
  {
    id: 'jeyuk-bokkeum',
    sourceKind: 'voice-transcript',
    sourceText: '친구가 말해준 음성 transcript 느낌: 제육은 고추장만 넣으면 텁텁하니까 고춧가루랑 간장을 같이 쓰고, 양파 갈아 넣으면 부드러워져. 센 불에 오래 볶지 말고 마지막에 불맛만 내.',
    recipeName: '매콤 제육볶음',
    serving: '3인분',
    time: '35분',
    ingredients: ['돼지고기 앞다리살 500g', '고추장 2큰술', '고춧가루 2큰술', '간장 2큰술', '간 양파 1/2개', '설탕 1큰술', '대파 1대', '양배추 한 줌'],
    steps: ['양념 재료를 섞어 돼지고기에 15분 재운다.', '팬을 달군 뒤 고기를 펼쳐 중강불에서 볶는다.', '양배추와 대파를 넣고 숨이 죽을 때까지 볶는다.', '마지막 30초만 센 불로 올려 수분을 날린다.'],
    tips: ['고기는 너무 얇지 않은 불고기감이 식감이 좋다.', '참기름은 불을 끈 뒤 넣어 향을 살린다.'],
    reviewNeeded: ['고기 두께에 따라 볶는 시간을 확인해야 한다.', '어린이용이면 고춧가루 양을 줄인다.'],
  },
  {
    id: 'gamja-jorim',
    sourceKind: 'voice-transcript',
    sourceText: '할머니 레시피 받아 적은 느낌: 감자는 모서리를 둥글게 깎으면 덜 부서지고, 간장물은 처음부터 세게 졸이지 말고 뚜껑 덮어서 익힌 다음 윤기만 내면 된다.',
    recipeName: '포슬 감자조림',
    serving: '2인분',
    time: '22분',
    ingredients: ['감자 3개', '간장 3큰술', '물 180ml', '올리고당 1큰술', '설탕 1작은술', '식용유 1큰술', '참깨 약간'],
    steps: ['감자를 한입 크기로 자르고 모서리를 정리한다.', '팬에 식용유를 두르고 감자 겉면을 2분 볶는다.', '간장, 물, 설탕을 넣고 뚜껑을 덮어 10분 익힌다.', '뚜껑을 열고 올리고당을 넣어 윤기 나게 졸인다.'],
    tips: ['감자를 물에 5분 담그면 전분이 빠져 깔끔하다.'],
    reviewNeeded: ['감자 크기에 따라 물 추가 여부를 확인한다.', '단맛 선호도에 따라 올리고당을 조절한다.'],
  },
  {
    id: 'gyeran-jjim',
    sourceKind: 'link',
    sourceText: '짧은 영상 링크 설명 느낌: 계란찜은 계란 3개에 물이나 다시마육수 180ml, 새우젓 조금. 뚝배기에서 약불로 저어주다가 몽글해지면 뚜껑 닫고 잔열로 마무리.',
    recipeName: '몽글 계란찜',
    serving: '2인분',
    time: '15분',
    ingredients: ['계란 3개', '다시마육수 180ml', '새우젓 1작은술', '맛술 1작은술', '대파 약간', '참기름 1/2작은술'],
    steps: ['계란을 풀고 육수와 새우젓을 섞어 체에 거른다.', '뚝배기에 붓고 약불에서 바닥을 긁듯 저어준다.', '몽글하게 응고되면 뚜껑을 덮고 4분 익힌다.', '불을 끄고 2분 뜸 들인 뒤 대파와 참기름을 올린다.'],
    tips: ['센 불은 바닥을 태우므로 약불을 유지한다.', '체에 거르면 더 부드러운 식감이 난다.'],
    reviewNeeded: ['새우젓 대신 소금을 쓸 경우 양을 다시 맞춰야 한다.', '뚝배기 크기에 따라 넘침 여부를 확인한다.'],
  },
  {
    id: 'diet-chicken-pasta',
    sourceKind: 'voice-transcript',
    sourceText: '다이어트식 릴스 transcript 느낌: 면은 통밀 파스타를 쓰고 닭가슴살이랑 토마토, 그릭요거트를 넣으면 크리미한데 무겁지 않아. 소스는 면수로 농도 맞춰.',
    recipeName: '가벼운 닭가슴살 토마토 파스타',
    serving: '1인분',
    time: '20분',
    ingredients: ['통밀 파스타 80g', '닭가슴살 120g', '방울토마토 8개', '마늘 2쪽', '그릭요거트 2큰술', '면수 1/2컵', '올리브오일 1작은술'],
    steps: ['파스타를 표시 시간보다 1분 짧게 삶고 면수를 남긴다.', '팬에 올리브오일과 마늘을 넣어 향을 낸다.', '닭가슴살과 토마토를 넣고 익힌다.', '면, 면수, 그릭요거트를 넣고 약불에서 농도를 맞춘다.'],
    tips: ['그릭요거트는 불을 줄인 뒤 넣어 분리되지 않게 한다.'],
    reviewNeeded: ['닭가슴살 염지 여부에 따라 소금 간을 확인한다.', '운동 목적이면 단백질 양을 조절한다.'],
  },
];

export function buildRecipeCardFromSample(sample: RecipeSample): RecipeCard {
  return {
    sourceTypeLabel: sample.sourceKind === 'link' ? '링크 샘플 변환' : '음성 transcript 샘플 변환',
    sourceText: sample.sourceText,
    recipeName: sample.recipeName,
    serving: sample.serving,
    time: sample.time,
    ingredients: sample.ingredients,
    steps: sample.steps,
    tips: sample.tips,
    reviewNeeded: sample.reviewNeeded,
    demoNotice: '실제 AI 추출이 아닌 데모/샘플 기반 변환 결과입니다.',
  };
}

export function buildDemoRecipeFromInput(link: string, audioFileName: string): RecipeCard {
  const sourceLines = [
    link ? `입력 링크: ${link}` : '입력 링크: 제공되지 않음',
    audioFileName ? `선택한 음성 파일: ${audioFileName}` : '선택한 음성 파일: 없음',
    '이 데모는 외부 API 호출 없이 샘플 구조로 결과 카드를 채웁니다.',
  ];

  return {
    sourceTypeLabel: '사용자 입력 데모 변환',
    sourceText: sourceLines.join('\n'),
    recipeName: '데모 변환 레시피',
    serving: '확인 필요',
    time: '확인 필요',
    ingredients: ['주재료: 링크/음성 원문에서 추출 예정', '양념: 원문 기반으로 정리 예정', '물 또는 육수: 필요 시 확인', '마무리 재료: 선택 사항'],
    steps: ['링크나 음성 transcript에서 핵심 조리 흐름을 추출합니다.', '재료와 분량을 표준화해 누락된 단위를 표시합니다.', '불 세기, 시간, 순서를 단계형 레시피로 정리합니다.'],
    tips: ['실서비스에서는 원문 품질이 낮으면 추가 질문으로 보완합니다.'],
    reviewNeeded: ['알레르기, 맵기, 가족 음성 사용 동의 여부를 확인해야 합니다.', '데모에서는 원본 업로드 파일을 저장하지 않는 전제로 안내합니다.'],
    demoNotice: '실제 AI 추출이 아닌 데모/샘플 기반 변환 결과입니다.',
  };
}
