(() => {
  const header = document.querySelector('[data-header]');
  if (!header) return;

  const toggle = header.querySelector('.menu-toggle');
  const primaryNav = header.querySelector('.primary-nav');
  const navLinks = [...header.querySelectorAll('.primary-nav a[data-menu]')];
  const megaMenu = header.querySelector('.mega-menu');
  const megaInner = header.querySelector('.mega-inner');
  const desktop = window.matchMedia('(min-width: 761px)');
  let closeTimer;

  const menus = {
    research: { title: '연구 분야', href: 'research.html', links: [['조직 상호작용 분석', 'research.html#corporate'], ['공간·서비스 경험', 'research.html#service'], ['교육·캠퍼스 연구', 'research.html#campus'], ['공공·도시 상호작용', 'research.html#public'], ['개인 상호작용 분석', 'research.html#personal']] },
    technology: { title: '핵심 기술', href: 'technology.html', links: [['기술 개요', 'technology.html#technology-overview'], ['AIS™ 어색함 분석 시스템', 'technology.html#ais-detail'], ['SRS 사회 반응 시뮬레이션', 'technology.html#srs-detail'], ['데이터 체계', 'technology.html#data-system'], ['적용 분야', 'technology.html#applications']] },
    projects: { title: '프로젝트', href: 'projects.html', links: [['엘리베이터 사회적 마찰', 'projects.html#project-024'], ['같은 방향으로 걷는 두 사람', 'projects.html#project-019'], ['좁은 길의 동선 충돌', 'projects.html#project-011']] },
    insights: { title: '소식과 자료', href: 'insights.html', links: [['연구 보고서', 'insights.html#reports'], ['연구소 소식', 'insights.html#news'], ['기술 업데이트', 'insights.html#news']] },
    careers: { title: '채용', href: 'careers.html', links: [['일하는 방식', 'careers.html#culture'], ['조직', 'careers.html#teams'], ['채용 직무', 'careers.html#positions'], ['지원 안내', 'careers.html#apply']] }
  };

  const searchableItems = [
    ['연구소 소개', '사이현상연구소의 미션과 조직', 'about.html', '회사 비전 이념 연혁 조직 연구소'],
    ['조직 상호작용 분석', '연구 분야', 'research.html#corporate', '기업 사내 협업 조직 데이터'],
    ['공간·서비스 경험', '연구 분야', 'research.html#service', '매장 공간 고객 서비스 동선'],
    ['교육·캠퍼스 연구', '연구 분야', 'research.html#campus', '학교 대학 학생 캠퍼스'],
    ['공공·도시 상호작용', '연구 분야', 'research.html#public', '공공기관 도시 시민'],
    ['개인 상호작용 분석', '연구 분야', 'research.html#personal', '개인 상담 의뢰 관계'],
    ['AIS™ 어색함 분석 시스템', '핵심 기술', 'technology.html#ais-detail', '어색함 지수 거리 침묵 시선 분석'],
    ['SRS 사회 반응 시뮬레이션', '핵심 기술', 'technology.html#srs-detail', '행동 예측 제안 시뮬레이션'],
    ['데이터 분석 체계', '핵심 기술', 'technology.html#data-system', '관찰 측정 분석 설계 개선'],
    ['엘리베이터 사회적 마찰', '프로젝트', 'projects.html#project-024', '업무 공간 승강기 사례'],
    ['같은 방향으로 걷는 두 사람', '프로젝트', 'projects.html#project-019', '교육 귀가 친구 대화 사례'],
    ['좁은 길의 동선 충돌', '프로젝트', 'projects.html#project-011', '서비스 공간 통로 사례'],
    ['사회적 어색함 보고서 2026', '소식과 자료', 'insights.html#reports', '연구 백서 데이터 보고서'],
    ['연구소 소식', '소식과 자료', 'insights.html#news', '업데이트 협약 발표 뉴스'],
    ['일하는 방식', '채용', 'careers.html#culture', '문화 질문 검증 현장'],
    ['조직과 팀', '채용', 'careers.html#teams', '부서 연구팀 데이터팀 디자인팀'],
    ['채용 직무', '채용', 'careers.html#positions', '연구원 분석가 디자이너 엔지니어'],
    ['지원 안내', '채용', 'careers.html#apply', '입사 지원 문의']
  ];

  const searchButton = document.createElement('button');
  searchButton.className = 'site-search-button';
  searchButton.type = 'button';
  searchButton.setAttribute('aria-label', '메뉴 검색 열기');
  searchButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.3"></circle><path d="m15.6 15.6 4.5 4.5"></path></svg>';

  if (primaryNav && toggle) {
    const headerActions = document.createElement('div');
    headerActions.className = 'header-actions';
    header.insertBefore(headerActions, toggle);
    headerActions.append(primaryNav, searchButton, toggle);
  }

  const searchDialog = document.createElement('dialog');
  searchDialog.className = 'site-search';
  searchDialog.setAttribute('aria-labelledby', 'site-search-title');
  searchDialog.innerHTML = `
    <div class="site-search__panel">
      <div class="site-search__top">
        <p id="site-search-title">무엇을 찾고 있나요?</p>
        <button class="site-search__close" type="button" aria-label="검색 닫기">닫기</button>
      </div>
      <label class="site-search__field">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.3"></circle><path d="m15.6 15.6 4.5 4.5"></path></svg>
        <span class="sr-only">검색어</span>
        <input type="search" autocomplete="off" placeholder="연구 분야, 기술, 프로젝트를 검색해보세요" />
      </label>
      <div class="site-search__meta"><span>추천 메뉴</span><span class="site-search__count"></span></div>
      <div class="site-search__results" aria-live="polite"></div>
    </div>`;
  document.body.append(searchDialog);

  const searchInput = searchDialog.querySelector('input');
  const searchResults = searchDialog.querySelector('.site-search__results');
  const searchCount = searchDialog.querySelector('.site-search__count');
  const searchMetaLabel = searchDialog.querySelector('.site-search__meta span');
  const normalize = value => value.normalize('NFKC').toLowerCase().replace(/\s+/g, '');

  const renderSearch = value => {
    const query = normalize(value);
    const matches = searchableItems.filter(item => !query || normalize(item.join(' ')).includes(query));
    searchMetaLabel.textContent = query ? '검색 결과' : '추천 메뉴';
    searchCount.textContent = query ? `${matches.length}개` : '';
    searchResults.innerHTML = matches.length
      ? matches.map(([title, group, href]) => `<a href="${href}"><span>${group}</span><strong>${title}</strong><b aria-hidden="true">↗</b></a>`).join('')
      : '<p class="site-search__empty">일치하는 메뉴가 없습니다.<br />다른 검색어를 입력해보세요.</p>';
  };

  const closeSearch = () => searchDialog.open && searchDialog.close();
  searchButton.addEventListener('click', () => {
    header.classList.remove('mobile-open', 'mega-open');
    toggle?.setAttribute('aria-expanded', 'false');
    renderSearch('');
    searchDialog.showModal();
    window.setTimeout(() => searchInput.focus(), 40);
  });
  searchDialog.querySelector('.site-search__close').addEventListener('click', closeSearch);
  searchDialog.addEventListener('click', event => {
    if (event.target === searchDialog) closeSearch();
  });
  searchDialog.addEventListener('close', () => searchButton.focus());
  searchInput.addEventListener('input', () => renderSearch(searchInput.value));
  searchResults.addEventListener('click', event => {
    if (event.target.closest('a')) closeSearch();
  });
  renderSearch('');

  const siteMap = document.createElement('dialog');
  siteMap.className = 'site-map';
  siteMap.id = 'site-map';
  siteMap.setAttribute('aria-labelledby', 'site-map-title');
  siteMap.innerHTML = `
    <div class="site-map__panel">
      <div class="site-map__head">
        <strong>사이현상연구소</strong>
        <button class="site-map__close" type="button" aria-label="전체 메뉴 닫기">×</button>
      </div>
      <div class="site-map__intro">
        <h2 id="site-map-title">연구에서 기술로,<br />기술에서 변화로.</h2>
        <p>사람 사이에서 반복되는 긴장을 관찰하고 측정해 조직, 공간과 서비스의 구체적인 변화로 연결합니다.</p>
      </div>
      <nav class="site-map__grid" aria-label="전체 메뉴">
        ${Object.entries(menus).map(([key, menu]) => `<section class="site-map__group" data-group="${key}"><a href="${menu.href}">${menu.title}</a><ul>${menu.links.map(([label, href]) => `<li><a href="${href}">${label}</a></li>`).join('')}</ul></section>`).join('')}
      </nav>
    </div>`;
  document.body.append(siteMap);

  const closeSiteMap = () => {
    if (siteMap.open) siteMap.close();
    toggle?.setAttribute('aria-expanded', 'false');
  };
  siteMap.querySelector('.site-map__close').addEventListener('click', closeSiteMap);
  siteMap.addEventListener('click', event => {
    if (event.target === siteMap) closeSiteMap();
    if (event.target.closest('a')) closeSiteMap();
  });
  siteMap.addEventListener('close', () => {
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.focus();
  });

  const motionToggle = document.querySelector('[data-motion-toggle]');
  const hero = document.querySelector('.hero');
  motionToggle?.addEventListener('click', () => {
    const paused = hero?.classList.toggle('motion-paused');
    motionToggle.setAttribute('aria-pressed', String(Boolean(paused)));
    motionToggle.textContent = paused ? '모션 재생' : '모션 일시정지';
  });

  if (document.querySelector('.hero')) {
    const noticeKey = 'sai-notice-campus-2026-10-v2';
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    let hiddenToday = false;
    try {
      hiddenToday = window.localStorage.getItem(noticeKey) === today;
    } catch (_) {
      hiddenToday = false;
    }

    const notice = document.createElement('dialog');
    notice.className = 'site-notice';
    notice.setAttribute('aria-labelledby', 'site-notice-title');
    notice.innerHTML = `
      <article class="site-notice__card">
        <div class="site-notice__visual">
          <img src="research-campus.png" alt="사이현상연구소의 대학 캠퍼스 상호작용 연구 공간" />
          <span>NEW RESEARCH · 2026.09</span>
        </div>
        <div class="site-notice__content">
          <button class="site-notice__close" type="button" aria-label="공지 닫기">×</button>
          <p>연구 결과 공개</p>
          <h2 id="site-notice-title">대학 캠퍼스에서<br />대화가 시작되는 조건</h2>
          <span>서울 소재 A대학교와 함께 공용 공간의 거리와 동선을 분석했습니다. 좌석 배치와 이동 단서를 조정한 뒤, 낯선 학생 사이의 자연스러운 대화 시작이 <strong>23% 증가</strong>했습니다.</span>
          <a href="insights.html#news">연구 결과 보기 <b aria-hidden="true">→</b></a>
          <button class="site-notice__today" type="button">오늘 하루 보지 않기</button>
        </div>
      </article>`;
    document.body.append(notice);

    const closeNotice = () => notice.open && notice.close();
    notice.querySelector('.site-notice__close').addEventListener('click', closeNotice);
    notice.querySelector('.site-notice__today').addEventListener('click', () => {
      try {
        window.localStorage.setItem(noticeKey, today);
      } catch (_) {
        // The notice still closes when storage is unavailable.
      }
      closeNotice();
    });
    notice.addEventListener('click', event => {
      if (event.target === notice) closeNotice();
    });

    if (!hiddenToday) {
      window.setTimeout(() => notice.showModal(), 450);
    }
  }

  const teamButtons = [...document.querySelectorAll('.team-open')];
  if (teamButtons.length) {
    const teams = [
      {
        number: '01', name: '상호작용 연구팀', label: 'INTERACTION RESEARCH', image: 'research-campus.png', facility: '행동 관찰실',
        role: '사람 사이에서 반복되는 침묵, 거리, 시선과 대화의 전환점을 현장에서 발견하고 연구 질문으로 구조화합니다.',
        activities: ['대학 캠퍼스의 대화 시작 조건 연구', '사회적 침묵 보고서 2026 후속 분석'],
        facilityText: '가변형 좌석과 천장형 행동 센서를 갖춘 관찰 공간에서 실제 상황에 가까운 상호작용을 기록합니다.'
      },
      {
        number: '02', name: '행동 데이터팀', label: 'BEHAVIORAL DATA', image: 'research-corporate.png', facility: '행동 데이터랩',
        role: '관찰 기록을 거리, 응답 지연, 시선 빈도와 같은 측정 가능한 신호로 변환하고 분석 모델의 신뢰도를 검증합니다.',
        activities: ['AIS 2.0 복합 신호 가중치 고도화', '비식별 행동 데이터 처리 체계 구축'],
        facilityText: '보안 분석망과 대형 시각화 월을 갖춘 전용 랩에서 행동 신호를 비교하고 모델 결과를 검수합니다.'
      },
      {
        number: '03', name: '제품·기술팀', label: 'PRODUCT & TECHNOLOGY', image: 'research-service.png', facility: '프로토타이핑 스튜디오',
        role: 'AIS와 SRS를 실제 프로젝트에서 사용할 수 있는 분석 도구와 시뮬레이션 제품으로 구현합니다.',
        activities: ['SRS 행동 변화 예측 엔진 개발', '현장 분석 대시보드와 센서 연동 개선'],
        facilityText: '센서 테스트베드와 인터랙션 시뮬레이터를 이용해 새로운 분석 기능을 빠르게 제작하고 검증합니다.'
      },
      {
        number: '04', name: '디자인팀', label: 'INTERACTION DESIGN', image: 'team-design-studio.png', facility: '인터랙션 디자인 스튜디오',
        role: '연구 결과를 공간, 서비스와 화면에서 사람들이 자연스럽게 경험할 수 있는 구체적인 변화로 번역합니다.',
        activities: ['엘리베이터 탑승 동선과 안내 체계 재설계', '서비스 공간의 대화 진입 단서 프로토타입'],
        facilityText: '서비스 블루프린트 월과 사용성 테스트 공간에서 동선, 안내물과 디지털 접점을 함께 설계합니다.'
      },
      {
        number: '05', name: '사업·파트너십팀', label: 'BUSINESS & PARTNERSHIPS', image: 'research-public.png', facility: '파트너 프로젝트룸',
        role: '기업, 대학과 공공기관의 문제를 연구 과제로 정의하고 각 조직에 맞는 협업 구조와 적용 범위를 설계합니다.',
        activities: ['기업·대학 공동 연구 파트너십 운영', '프로젝트 전후 효과와 사업 성과 측정'],
        facilityText: '파트너와 연구진이 한 공간에서 질문을 정리하고 중간 결과를 검토하는 공동 워크숍 공간입니다.'
      },
      {
        number: '06', name: '피플·컬처팀', label: 'PEOPLE & CULTURE', image: 'team-people-culture.png', facility: '피플 포럼',
        role: '서로 다른 전문성을 가진 구성원이 안전하게 질문하고 함께 검증할 수 있도록 채용과 조직문화를 설계합니다.',
        activities: ['연구 윤리와 현장 안전 교육 운영', '직무별 채용 체계와 내부 지식 아카이브 구축'],
        facilityText: '팀 회고, 공개 세미나와 지원자 인터뷰를 유연하게 운영할 수 있는 소규모 다목적 공간입니다.'
      }
    ];

    const teamDialog = document.createElement('dialog');
    teamDialog.className = 'team-dialog';
    teamDialog.setAttribute('aria-labelledby', 'team-dialog-title');
    teamDialog.innerHTML = `
      <article class="team-dialog__panel">
        <div class="team-dialog__image"><img src="" alt="" /><span></span></div>
        <div class="team-dialog__content">
          <button class="team-dialog__close" type="button" aria-label="팀 소개 닫기">×</button>
          <div class="team-dialog__heading"><span></span><p></p><h2 id="team-dialog-title"></h2></div>
          <section><h3>팀이 맡은 역할</h3><p class="team-dialog__role"></p></section>
          <section><h3>현재 활동</h3><ul class="team-dialog__activities"></ul></section>
          <section class="team-dialog__facility"><h3>시설</h3><strong></strong><p></p></section>
        </div>
      </article>`;
    document.body.append(teamDialog);

    const renderTeam = team => {
      const image = teamDialog.querySelector('img');
      image.src = team.image;
      image.alt = `${team.name}이 사용하는 ${team.facility}`;
      teamDialog.querySelector('.team-dialog__image span').textContent = team.facility;
      teamDialog.querySelector('.team-dialog__heading>span').textContent = team.number;
      teamDialog.querySelector('.team-dialog__heading>p').textContent = team.label;
      teamDialog.querySelector('.team-dialog__heading h2').textContent = team.name;
      teamDialog.querySelector('.team-dialog__role').textContent = team.role;
      teamDialog.querySelector('.team-dialog__activities').innerHTML = team.activities.map(activity => `<li>${activity}</li>`).join('');
      teamDialog.querySelector('.team-dialog__facility strong').textContent = team.facility;
      teamDialog.querySelector('.team-dialog__facility p').textContent = team.facilityText;
    };

    teamButtons.forEach(button => button.addEventListener('click', () => {
      renderTeam(teams[Number(button.dataset.team)]);
      teamDialog.showModal();
    }));
    const closeTeam = () => teamDialog.open && teamDialog.close();
    teamDialog.querySelector('.team-dialog__close').addEventListener('click', closeTeam);
    teamDialog.addEventListener('click', event => {
      if (event.target === teamDialog) closeTeam();
    });
  }

  const positionButtons = [...document.querySelectorAll('.position-open')];
  if (positionButtons.length) {
    const positions = [
      {
        title: '상호작용 연구원', team: '상호작용 연구팀', summary: '현장 관찰과 인터뷰를 통해 사람 사이의 미세한 마찰을 연구 질문으로 구조화합니다.',
        responsibilities: ['현장 연구와 사용자 인터뷰 설계', '질적·행동 데이터 통합 분석', '연구 보고서 및 파트너 프레젠테이션 작성'],
        qualifications: ['UX 리서치·인간공학·사회과학 관련 경험', '독립적인 연구 설계와 실행 역량', '다른 직군과 명확하게 협업하는 능력']
      },
      {
        title: '행동 데이터 분석가', team: '행동 데이터팀', summary: '관찰된 행동 신호를 분석 가능한 데이터로 만들고 AIS™의 판단 근거를 검증합니다.',
        responsibilities: ['행동 데이터 스키마와 지표 설계', '통계 분석 및 데이터 시각화', 'AIS™ 모델 성능 검증과 개선'],
        qualifications: ['Python·R·SQL 중 하나를 활용한 분석 경험', '통계적 추론과 시각화 역량', '개인정보 보호와 연구 윤리에 대한 이해']
      },
      {
        title: '인터랙션 디자이너', team: '디자인팀', summary: '연구에서 발견한 패턴을 공간·서비스·디지털 경험의 구체적인 변화로 전환합니다.',
        responsibilities: ['서비스 블루프린트와 경험 시나리오 설계', '공간·디지털 프로토타입 제작', '현장 실험과 사용성 검증'],
        qualifications: ['UX·서비스 디자인 포트폴리오', '빠른 프로토타이핑과 검증 경험', '복잡한 시스템을 구조화하는 사고력']
      },
      {
        title: '프론트엔드 엔지니어', team: '제품·기술팀', summary: 'AIS™와 SRS의 분석 결과를 연구자와 파트너가 이해하고 활용할 수 있는 제품으로 구현합니다.',
        responsibilities: ['분석 대시보드와 인터랙션 UI 개발', '데이터 시각화 컴포넌트 구축', '접근성·성능·디자인 시스템 품질 관리'],
        qualifications: ['JavaScript 또는 TypeScript 기반 웹 개발 경험', '반응형 UI와 데이터 시각화 경험', '디자이너·연구자와의 협업 역량']
      }
    ];
    const positionDialog = document.createElement('dialog');
    positionDialog.className = 'position-dialog';
    positionDialog.setAttribute('aria-labelledby', 'position-dialog-title');
    positionDialog.innerHTML = `<article class="position-dialog__panel">
      <div class="position-dialog__intro"><button class="position-dialog__close" type="button" aria-label="채용 상세 닫기">×</button><span>OPEN POSITION</span><h2 id="position-dialog-title"></h2><p class="position-dialog__summary"></p></div>
      <div class="position-dialog__body"><div class="position-dialog__meta"><span class="position-dialog__team"></span><span>서울 · 정규직</span></div><section class="position-dialog__section"><h3>주요 업무</h3><ul class="position-dialog__responsibilities"></ul></section><section class="position-dialog__section"><h3>이런 동료를 찾습니다</h3><ul class="position-dialog__qualifications"></ul></section><section class="position-dialog__section"><h3>합류 과정</h3><p class="position-dialog__process">지원서 검토 → 인터뷰 → 직무 대화·과제 → 최종 합류</p></section><a class="position-dialog__apply" href="mailto:career@awkwardlab.kr"><b>이 직무에 지원하기</b><span>→</span></a></div>
    </article>`;
    document.body.append(positionDialog);

    const renderPosition = position => {
      positionDialog.querySelector('#position-dialog-title').textContent = position.title;
      positionDialog.querySelector('.position-dialog__summary').textContent = position.summary;
      positionDialog.querySelector('.position-dialog__team').textContent = position.team;
      positionDialog.querySelector('.position-dialog__responsibilities').innerHTML = position.responsibilities.map(item => `<li>${item}</li>`).join('');
      positionDialog.querySelector('.position-dialog__qualifications').innerHTML = position.qualifications.map(item => `<li>${item}</li>`).join('');
      positionDialog.querySelector('.position-dialog__apply').href = `mailto:career@awkwardlab.kr?subject=${encodeURIComponent(`[채용 지원] ${position.title}`)}`;
    };
    positionButtons.forEach(button => button.addEventListener('click', () => {
      renderPosition(positions[Number(button.dataset.position)]);
      positionDialog.showModal();
    }));
    const closePosition = () => positionDialog.open && positionDialog.close();
    positionDialog.querySelector('.position-dialog__close').addEventListener('click', closePosition);
    positionDialog.addEventListener('click', event => {
      if (event.target === positionDialog) closePosition();
    });
  }

  const renderMenu = key => {
    const menu = menus[key];
    if (!menu || !megaInner) return;
    megaInner.innerHTML = `<div class="mega-context"><a class="mega-title" href="${menu.href}">${menu.title}<span aria-hidden="true">→</span></a><div class="mega-links">${menu.links.map(([label, href]) => `<a href="${href}">${label}</a>`).join('')}</div></div>`;
  };

  const openMega = key => {
    if (!desktop.matches) return;
    clearTimeout(closeTimer);
    renderMenu(key);
    header.classList.add('mega-open');
    megaMenu?.setAttribute('aria-hidden', 'false');
  };

  const closeMega = () => {
    clearTimeout(closeTimer);
    closeTimer = window.setTimeout(() => {
      header.classList.remove('mega-open');
      megaMenu?.setAttribute('aria-hidden', 'true');
    }, 140);
  };

  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => openMega(link.dataset.menu));
    link.addEventListener('focus', () => openMega(link.dataset.menu));
    link.addEventListener('click', () => {
      header.classList.remove('mobile-open', 'mega-open');
      toggle?.setAttribute('aria-expanded', 'false');
    });
  });

  header.addEventListener('mouseenter', () => clearTimeout(closeTimer));
  header.addEventListener('mouseleave', closeMega);
  megaInner?.addEventListener('click', () => header.classList.remove('mega-open'));

  toggle?.addEventListener('click', () => {
    header.classList.remove('mobile-open', 'mega-open');
    toggle.setAttribute('aria-expanded', 'true');
    siteMap.showModal();
  });

  const toast = document.querySelector('.toast');
  let toastTimer;
  document.querySelectorAll('[data-notice]').forEach(button => button.addEventListener('click', () => {
    if (!toast) return;
    clearTimeout(toastTimer);
    toast.textContent = button.dataset.notice;
    toast.classList.add('show');
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2600);
  }));
})();
