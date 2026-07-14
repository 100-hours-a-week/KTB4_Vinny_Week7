export const movies = [
  {
    movieId: "interstellar",
    title: "인터스텔라",
    originalTitle: "Interstellar",
    releaseYear: "2014",
    genre: "SF",
    runtime: "169분",
    rating: 4.3,
    ratingCount: 12842,
    reviewCount: 1248,
    posterUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
    description: "지구의 환경이 급격히 악화되어 인류의 생존이 위협받는 미래. 전직 파일럿 쿠퍼는 가족을 뒤로하고 새로운 보금자리를 찾아 우주로 떠난다."
  },
  {
    movieId: "tenet",
    title: "테넷",
    originalTitle: "Tenet",
    releaseYear: "2020",
    genre: "액션",
    runtime: "150분",
    rating: 4.1,
    ratingCount: 9320,
    reviewCount: 846,
    posterUrl: "https://image.tmdb.org/t/p/w500/k68nPLbIST6NP96JmTxmZijEvCA.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/yY76zq9XSuJ4nWyPDuwkdV7Wt0c.jpg",
    description: "시간의 흐름을 뒤집는 인버전을 둘러싸고 전 세계의 운명이 걸린 작전이 시작된다."
  },
  {
    movieId: "joker",
    title: "조커",
    originalTitle: "Joker",
    releaseYear: "2019",
    genre: "드라마",
    runtime: "122분",
    rating: 4.4,
    ratingCount: 11583,
    reviewCount: 982,
    posterUrl: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/n6bUvigpRFqSwmPp1m2YADdbRBc.jpg",
    description: "고담의 외로운 광대 아서 플렉이 자신만의 웃음과 분노를 통해 조커로 변해간다."
  },
  {
    movieId: "shawshank",
    title: "쇼생크 탈출",
    originalTitle: "The Shawshank Redemption",
    releaseYear: "1994",
    genre: "드라마",
    runtime: "142분",
    rating: 4.8,
    ratingCount: 18524,
    reviewCount: 1574,
    posterUrl: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg",
    description: "누명을 쓰고 수감된 은행가 앤디가 감옥 안에서 희망을 잃지 않고 자유를 향해 나아간다."
  },
  {
    movieId: "your-name",
    title: "너의 이름은.",
    originalTitle: "Your Name.",
    releaseYear: "2016",
    genre: "애니메이션",
    runtime: "107분",
    rating: 4.7,
    ratingCount: 14207,
    reviewCount: 1308,
    posterUrl: "https://image.tmdb.org/t/p/w500/q719jXXEzOoYaps6babgKnONONX.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/mMtUybQ6hL24FXo0F3Z4j2KG7kZ.jpg",
    description: "서로의 몸이 뒤바뀌는 신비한 경험을 하게 된 두 소년 소녀가 시간과 거리를 넘어 서로를 찾아간다."
  }
];

export const featuredMovieId = "inception";

export const featuredMovie = {
  movieId: "inception",
  title: "인셉션",
  originalTitle: "Inception",
  releaseYear: "2010",
  genre: "SF",
  runtime: "148분",
  rating: 4.6,
  ratingCount: 15631,
  reviewCount: 1416,
  posterUrl: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
  backdropUrl: "https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
  description: "꿈 속의 꿈, 현실과 환상을 넘나드는 놀라운 상상력. 당신의 인식을 뒤흔드는 경험을 선사합니다."
};

export const reviews = [
  {
    reviewId: "review-1",
    nickname: "영화좋아",
    avatarUrl: "https://i.pravatar.cc/96?img=47",
    movieId: "interstellar",
    rating: 4.5,
    content: "스토리와 연출, 음악까지 완벽한 조화! 두 번, 세 번 다시 보고 싶은 영화예요.",
    createdAt: "2시간 전",
    likeCount: 12,
    reviewCount: 3
  },
  {
    reviewId: "review-2",
    nickname: "필름마니아",
    avatarUrl: "https://i.pravatar.cc/96?img=12",
    movieId: "tenet",
    rating: 4.0,
    content: "시간의 개념을 새롭게 정의한 영화. 복잡하지만 그래서 더 매력적입니다.",
    createdAt: "5시간 전",
    likeCount: 8,
    reviewCount: 1
  },
  {
    reviewId: "review-3",
    nickname: "무비탐험가",
    avatarUrl: "https://api.dicebear.com/9.x/adventurer/svg?seed=movie",
    movieId: "shawshank",
    rating: 5.0,
    content: "희망을 잃지 않는 인간의 의지를 그린 명작 중의 명작!",
    createdAt: "어제",
    likeCount: 15,
    reviewCount: 2
  }
];
