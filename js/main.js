
/*=================================================
strengths （カード）
===================================================*/
document.addEventListener('DOMContentLoaded', () => {
  // ================================================
  // I. 要素取得
  // ================================================
  const section = document.getElementById('strengths');
  const container = document.querySelector('.card-stack-container');
  const cards = document.querySelectorAll('.info-card');
  const pcDetailSection = document.getElementById('card-detail-section');

  const SCROLL_OFFSET = 500;
  const MOBILE_BREAKPOINT = 768;

  // モバイル判定ヘルパー
  const isMobile = () => window.innerWidth <= MOBILE_BREAKPOINT;

  let openMobileDetailElement = null; // 現在開いているモバイル詳細DOM要素
  let openPlaceholderElement = null; // 現在開いているプレースホルダーDOM要素
  let openCardElement = null; // モバイルで開いているカード要素（角を制御するため）

  // ================================================
  // II. スクロール時アニメーション（IntersectionObserver）
  // ================================================
  if (section && container) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // PCでのみ複雑なアニメーションを発火
            if (!isMobile()) {
              container.classList.add('is-active');
            }
            // 一度発火したら解除
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(section);
  }


  // ================================================
  // III. カード詳細表示（クリック開閉 & スクロール調整）
  // ================================================
  const details = {
    1: {
      title: "週1回の1on1授業",
      body: "あなたの現在のスキルレベル、学習進捗、最終目標をヒアリングした上で、現役エンジニアである講師が毎週きめ細かくサポートします。教材の疑問解消だけでなく、課題に対するコードレビューやキャリアパスに関する具体的なアドバイスを通して、確実なスキルアップを実現します。これにより、独学では難しい「本当に現場で使える力」を最短距離で身につけることができます。"
    },
    2: {
      title: "案件獲得までを徹底サポート",
      body: "学習の最終ゴールである「案件獲得」を見据えた実践的なサポートを提供します。クライアントの課題を解決するための要件定義、技術選定、設計を含むポートフォリオの企画・開発を指導。さらに、実戦を想定した営業資料のブラッシュアップ、商談シミュレーション、単価交渉のテクニックまで、フリーランスとして独立するために必要なビジネススキルを徹底的に鍛え上げます。"
    },
    3: {
      title: "営業代行サポート",
      body: "スキル習得と並行して行う煩雑な営業活動の一部（クライアントへのアプローチ、条件交渉など）をスクールが代行します。これにより、受講生は技術の研鑽とポートフォリオ制作に集中することが可能です。初めての実案件獲得のハードルを下げ、安心して実務経験を積むことができる環境を提供し、スムーズなフリーランスデビューを強力に後押しします。"
    },
    4: {
      title: "コミュニティで仲間と繋がる",
      body: "受講生および卒業生が参加できるコミュニティを提供しています。日々の技術的な質問はもちろん、最新技術の情報共有、モチベーションの維持、案件の紹介・連携など、多岐にわたる交流が可能です。特に「勉強会」や「モブプログラミング」などの企画を通じて、卒業後もプロとして活躍し続けるための生涯にわたる仲間と強力なネットワークを築くことができます。"
    }
  };

  /**
   * モバイル用アコーディオンを開いているカードの下の行に移動させるためのプレースホルダーを作成し挿入する
   * @param {HTMLElement} currentCard クリックされたカード要素
   * @returns {HTMLElement} 作成されたプレースホルダー要素
   */
  const insertPlaceholder = (currentCard) => {
    // クリックされたカードのインデックスを取得 (0, 1, 2, 3)
    const index = Array.from(cards).indexOf(currentCard);

    // 挿入位置を決定: 2x2 グリッドの場合、アコーディオンはグリッドの2列をまたぐため、
    // 常にカードの行の末尾の要素の直後にプレースホルダーを挿入する。
    // 
    // index 0 (1枚目) -> index 1 (2枚目)の直後に挿入
    // index 1 (2枚目) -> index 1 (2枚目)の直後に挿入
    // index 2 (3枚目) -> index 3 (4枚目)の直後に挿入
    // index 3 (4枚目) -> index 3 (4枚目)の直後に挿入
    const isFirstRow = index < 2;
    const targetCard = isFirstRow ? cards[1] : cards[3]; // 挿入位置を制御するカード

    // プレースホルダーの作成
    const placeholder = document.createElement('div');
    placeholder.className = 'mobile-accordion-placeholder';

    // 挿入: targetCardが存在すればその直後に挿入する
    if (targetCard && targetCard.nextSibling) {
      container.insertBefore(placeholder, targetCard.nextSibling);
    } else if (targetCard) {
      // targetCardが最後の要素の場合は末尾に追加
      container.appendChild(placeholder);
    }

    return placeholder;
  }

  /**
   * プレースホルダーの高さを計算し、アコーディオンの高さと同期させる
   * @param {HTMLElement} detailEl アコーディオン要素
   * @param {HTMLElement} placeholderEl プレースホルダー要素
   * @param {boolean} isOpen 開く動作か閉じる動作か
   */
  const syncPlaceholderHeight = (detailEl, placeholderEl, isOpen) => {
    if (!detailEl || !placeholderEl) return;

    if (isOpen) {
      // アコーディオンを開く
      // detailEl.classList.add('is-open')後に実行する必要があるため、setTimeoutでディレイ
      setTimeout(() => {
        // アコーディオンの実際の高さを取得
        const finalHeight = detailEl.offsetHeight + 16; // 16pxはグリッドの隙間分
        placeholderEl.style.height = `${finalHeight}px`;
      }, 10);

    } else {
      // アコーディオンを閉じる
      placeholderEl.style.height = '0';
      // プレースホルダーを削除
      setTimeout(() => {
        placeholderEl.remove();
        openPlaceholderElement = null;
      }, 300); // CSS transition timeに合わせて
    }
  }


  // -----------------------------------
  // ★ カードクリックイベント
  // -----------------------------------
  cards.forEach(card => {
    // モバイル版の矢印HTMLを事前に挿入 (前回の修正で追加済みだが、ロジック維持のため残す)
    const cardTextContent = card.querySelector('.card-text-content');
    if (cardTextContent && !card.querySelector('.mobile-arrow-icon')) {
      const arrow = document.createElement('div');
      arrow.className = 'mobile-arrow-icon';
      cardTextContent.appendChild(arrow);
    }

    card.addEventListener('click', () => {
      const id = card.dataset.cardId;
      const data = details[id];
      if (!data) return;

      // -----------------------------------
      // A. クリック直後の transform 衝突を防ぐ (PC専用)
      // -----------------------------------
      if (!isMobile()) {
        card.style.transition = "none";
        setTimeout(() => {
          card.style.transition = "";
        }, 50);
        // PC処理に移行
        if (!pcDetailSection) return;

        // B. 同じカードをクリック → 閉じる
        if (pcDetailSection.dataset.openId === id) {
          pcDetailSection.classList.remove('is-open');
          pcDetailSection.removeAttribute('data-open-id');
          return;
        }

        // C. 内容をセットして開く
        pcDetailSection.innerHTML = `
                    <div class="detail-content">
                        <h3>${data.title}</h3>
                        <p>${data.body}</p>
                    </div>
                `;

        pcDetailSection.classList.add('is-open');
        pcDetailSection.dataset.openId = id;


        // D. スクロールをオフセットつきで調整
        const targetPosition =
          pcDetailSection.getBoundingClientRect().top + window.scrollY;

        const finalScrollPosition = targetPosition - SCROLL_OFFSET;

        window.scrollTo({
          top: finalScrollPosition,
          behavior: 'smooth'
        });
        return;
      }

      // ===================================
      // モバイル処理: アコーディオン表示
      // ===================================

      const isCurrentCardOpen = openCardElement && openCardElement.dataset.cardId === id;

      // -----------------------------------
      // 1. 既に開いている詳細があれば閉じる
      // -----------------------------------
      if (openMobileDetailElement) {

        openMobileDetailElement.classList.remove('is-open');

        if (openPlaceholderElement) {
          // プレースホルダーの高さを0にし、300ms後に要素を削除
          syncPlaceholderHeight(openMobileDetailElement, openPlaceholderElement, false);
          // openPlaceholderElementは syncPlaceholderHeight 内で null に設定される
        }

        if (openCardElement) {
          openCardElement.classList.remove('is-active-mobile');
        }

        // アコーディオン本体を削除
        openMobileDetailElement.remove();
        openMobileDetailElement = null;
        openCardElement = null;

        // 同じカードを再度クリックした場合、閉じて終了
        if (isCurrentCardOpen) {
          return;
        }

        // 別のカードをクリックした場合は、閉じる処理の後に開く処理を続行
      }

      // -----------------------------------
      // 2. 新しい詳細DOM要素とプレースホルダーを作成し挿入
      // -----------------------------------

      // プレースホルダーを適切な位置に挿入し、次の行のカードを押し下げる
      openPlaceholderElement = insertPlaceholder(card);

      // アコーディオン本体の作成
      const newDetail = document.createElement('div');
      newDetail.className = 'mobile-detail-accordion';
      newDetail.dataset.cardId = id;
      newDetail.innerHTML = `
          <div class="detail-content">
              <h3>${data.title}</h3>
              <p>${data.body}</p>
          </div>
      `;

      container.insertBefore(newDetail, openPlaceholderElement);


      // -----------------------------------
      // 3. transitionのためにクラスを付与し、高さを同期
      // -----------------------------------
      setTimeout(() => {
        newDetail.classList.add('is-open');
        card.classList.add('is-active-mobile'); // 角と矢印の制御用クラスを付与

        // プレースホルダーの高さをアコーディオンの高さと同期
        syncPlaceholderHeight(newDetail, openPlaceholderElement, true);
      }, 10);

      openMobileDetailElement = newDetail;
      openCardElement = card; // 角を制御するためのカードを記憶

      // -----------------------------------
      // 4. スクロール調整 (カードの少し上にスクロール)
      // -----------------------------------
      const targetPosition = card.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: targetPosition - 20,
        behavior: 'smooth'
      });
    });
  });

  // =========================================================
  // ウィンドウサイズ変更時のモバイル詳細要素のクリーンアップ (PCに戻った時のための措置)
  // =========================================================
  window.addEventListener('resize', () => {
    // モバイルからPCのブレイクポイントを超えた時
    if (window.innerWidth > MOBILE_BREAKPOINT) {
      if (openMobileDetailElement) {
        openMobileDetailElement.remove();
        openMobileDetailElement = null;
      }
      if (openPlaceholderElement) {
        openPlaceholderElement.remove();
        openPlaceholderElement = null;
      }
      if (openCardElement) {
        openCardElement.classList.remove('is-active-mobile');
        openCardElement = null;
      }
    }
  });
});


/*=================================================
スクロール時の画像フェード表示
===================================================*/
// スクロール時のイベント
$(window).scroll(function () {
  // fadeinクラスに対して順に処理を行う
  $(".fadein").each(function () {
    // スクロールした距離
    let scroll = $(window).scrollTop();
    // fadeinクラスの要素までの距離
    let target = $(this).offset().top;
    // 画面の高さ
    let windowHeight = $(window).height();
    // fadeinクラスの要素が画面下にきてから200px通過した
    // したタイミングで要素を表示
    if (scroll > target - windowHeight + 200) {
      $(this).css("opacity", "1");
      $(this).css("transform", "translateY(0)");
    }
  });
});


/*=================================================
ハンバーガ―メニュー & スムーススクロール
===================================================*/
$(document).ready(function () {

  const header = $("header");

  // ハンバーガー開閉
  $(".hamburger").on("click", function (e) {
    e.stopPropagation();
    header.toggleClass("open");
  });

  // メニューリンククリック
  $(".flip-nav a").on("click", function (e) {
    const isSP = $(window).width() <= 768; // SP判定

    if (isSP) {
      // SP版はリンク本来の動作のみ
      header.removeClass("open"); // メニュー閉じる
      return true;
    }

    // PC版のみスムーススクロール
    e.preventDefault();
    const target = $(this).attr("href");
    $("html, body").stop().animate({
      scrollTop: $(target).offset().top - 100 // header高さ分オフセット
    }, 600);

    header.removeClass("open");
  });

  // メニュー以外クリックで閉じる
  $(document).on("click", function (e) {
    if (!$(e.target).closest("header").length) {
      header.removeClass("open");
    }
  });

  // 汎用スムーススクロール（PC版のみ）
  $('a[href^="#"]').on("click", function (e) {
    const isSP = $(window).width() <= 768; // SP判定

    if (isSP) {
      // SP版は何もしない（デフォルトのジャンプ動作）
      return true;
    }

    // PC版のみスムーススクロール
    e.preventDefault();
    const target = $(this).attr("href");
    $("html, body").stop().animate({
      scrollTop: $(target).offset().top - 100
    }, 600);
  });

});


/*=================================================
  achievements
===================================================*/
let currentPage = 0;
const pages = document.querySelectorAll(".student-page");

pages.forEach((page, i) => {
  page.style.zIndex = pages.length - i;
});

function flipNextPage() {
  const page = pages[currentPage];
  if (!page) return;

  // めくるアニメーション開始
  page.classList.add("flip");

  // 2.2s 後にページを後ろに回す（transition と合わせて！）
  setTimeout(() => {
    page.style.zIndex = 0;
  }, 2200);

  currentPage++;

  // 最後まで行ったらリセット
  if (currentPage === pages.length) {
    setTimeout(() => {
      pages.forEach((p, i) => {
        p.classList.remove("flip");
        p.style.zIndex = pages.length - i;
      });
      currentPage = 0;
    }, 2500);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const book = document.querySelector(".book-item");
  if (book) {
    book.addEventListener("click", flipNextPage);
  }
});

/*=================================================
  teachers
===================================================*/

gsap.registerPlugin(ScrollTrigger);

window.addEventListener("load", () => {
  const lists = document.querySelectorAll(".teacher-list-area .list");
  const listArea = document.querySelector(".teacher-list-area");

  if (!lists.length) return;

  const listHeight = window.innerWidth <= 768 ? 300 : 400;
  const pinDistance = lists.length * listHeight;

  // 初期値は GSAP でセット（CSSとは衝突しない）
  gsap.set(lists, { opacity: 0, y: 80 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: listArea,
      start: "top top",
      end: "+=" + pinDistance,
      scrub: true,
      pin: listArea,
      anticipatePin: 1
    }
  });

  lists.forEach((item, i) => {
    tl.to(
      item,
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
      },
      i * 0.8
    );
  });
});


/*=================================================
  metaleaf
===================================================*/
$(function () {
  // feature をクリック → モーダルを開く
  $('.feature').on('click', function () {
    const modalId = $(this).data('modal');
    $('#' + modalId).addClass('open');

    // ▼スクロールを止める
    $('body').css('overflow', 'hidden');
  });

  // 閉じるボタン
  $('.modal .close').on('click', function () {
    $(this).closest('.modal').removeClass('open');

    // ▼スクロールを戻す
    $('body').css('overflow', 'auto');
  });

  // モーダル背景をクリック → 閉じる
  $('.modal').on('click', function (e) {
    if ($(e.target).hasClass('modal')) {
      $(this).removeClass('open');

      // ▼スクロールを戻す
      $('body').css('overflow', 'auto');
    }
  });
});


// 5Stepのレスポンシブ時のアニメーション
let lastScroll = 0;

$(window).on('scroll load', function () {
  var scroll = $(window).scrollTop();
  var windowHeight = $(window).height();
  var scrollingDown = scroll > lastScroll; // 下にスクロールしているか

  if (scrollingDown) { // 下スクロール時のみ発火
    $('#sp-curriculum .sp-step-img').each(function (i) {
      var $el = $(this);
      var target = $(this).offset().top;

      // 下スクロールで画面下から200px通過したタイミング
      if (scroll > target - windowHeight -500) {
        if (!$el.hasClass('roll-in')) {
          setTimeout(function () {
            $el.addClass('roll-in');
          }, i * 150);
        }
      }
    });
  }

  lastScroll = scroll; // 現在のスクロール位置を保存
});


// フッターの無料カウンセリングボタン（SP時）

let pagetop = $(".line-sp");
pagetop.hide(); // 最初は非表示

// SPのみ有効にする判定
function isSP() {
  return $(window).width() <= 768; // 768px以下をSPとする例
}

// スクロールイベント
$(window).scroll(function () {
  if (!isSP()) {
    pagetop.hide(); // SP以外は非表示
    return;
  }

  if ($(this).scrollTop() > 200) { // SPなら200px以上で表示
    pagetop.fadeIn();
  } else {
    pagetop.fadeOut();
  }
});

// リサイズ対応（画面サイズ変更時に表示/非表示をリセット）
$(window).resize(function () {
  if (!isSP()) {
    pagetop.hide();
  }
});




