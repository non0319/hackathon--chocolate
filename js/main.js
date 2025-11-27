
document.addEventListener('DOMContentLoaded', () => {
  // ================================================
  // I. 要素取得と定数定義
  // ================================================
  const section = document.getElementById('strengths');
  const container = document.querySelector('.card-stack-container');
  const cards = document.querySelectorAll('.info-card');
  const pcDetailSection = document.getElementById('card-detail-section');
  // HTMLに配置した詳細ブロックを取得
  const detailBlocks = document.querySelectorAll('.mobile-detail-block');

  const MOBILE_BREAKPOINT = 768;
  const SCROLL_OFFSET = 500;

  // 状態変数
  let openDetailBlock = null;
  let openCardElement = null;

  const isMobile = () => window.innerWidth <= MOBILE_BREAKPOINT;

  // PC詳細データ (PC処理のために維持)
  const details = {
    1: { title: "最短で成長できる“戦略的”学習プラン", body: "あなた専属のマンツーマンコーチが、今のレベルに合わせて無理なく学習を進められるようサポートします。毎週の振り返りでつまずきを解消。24時間LINEで質問できるので、分からないまま置いていかれる心配もありません。一人ひとりに合った進め方で、効率的にステップアップできます。" },
    2: { title: "弱点を見える化して、効率よく成長", body: "独学だと「何を優先して学べばいいか分からない…」こともあります。専属コーチがあなたの弱点や課題を分析し、今取り組むべきポイントを明確化。どこを強化すれば成果につながるかが分かるので、ムダなく効率的にスキルアップできます。" },
    3: { title: "初めての案件も安心。プロが伴走", body: "学習後は、実際の案件獲得に向けてプロの営業担当が商談に同行してくれます。実際のやり取りを間近で学び、フィードバックを受けながら対応力を高められるので、初めてでも安心して挑戦できます。学習から案件獲得まで、迷わず一歩ずつ進める環境が整っています。" },
    4: { title: "コミュニティで仲間と繋がる", body: "受講生や卒業生が参加できるコミュニティで、技術の質問や情報共有、モチベーション維持、案件の紹介など幅広く交流できます。プログラミングを学習している仲間たちと、世界中どこにいてもつながれる環境です。同じ目標に向かって頑張る仲間がいるから、モチベーションも高まり、学習や成長を続けやすくなります。" }
  };

  // ================================================
  // II. 初期設定とイベント
  // ================================================

  // スクロール時アニメーション
  if (section && container) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (!isMobile()) {
              container.classList.add('is-active');
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(section);
  }

  // 矢印アイコンのDOM挿入
  cards.forEach(card => {
    const cardTextContent = card.querySelector('.card-text-content');
    if (cardTextContent && !card.querySelector('.mobile-arrow-icon')) {
      const arrow = document.createElement('div');
      arrow.className = 'mobile-arrow-icon';
      cardTextContent.appendChild(arrow);
    }
  });


  // ★ カードクリックイベント
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.cardId;
      const data = details[id];
      if (!data) return;

      // -----------------------------------
      // A. PC処理 (変更なし)
      // -----------------------------------
      if (!isMobile()) {
        card.style.transition = "none";
        setTimeout(() => { card.style.transition = ""; }, 50);

        if (!pcDetailSection) return;

        if (pcDetailSection.dataset.openId === id) {
          pcDetailSection.classList.remove('is-open');
          pcDetailSection.removeAttribute('data-open-id');
          return;
        }

        pcDetailSection.innerHTML = `<div class="detail-content"><h3>${data.title}</h3><p>${data.body}</p></div>`;
        pcDetailSection.classList.add('is-open');
        pcDetailSection.dataset.openId = id;

        const targetPosition = pcDetailSection.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: targetPosition - SCROLL_OFFSET, behavior: 'smooth' });
        return;
      }

      // -----------------------------------
      // B. モバイル処理 (max-height方式)
      // -----------------------------------

      // クリックされたカードに対応する詳細ブロックを取得
      const targetDetail = document.querySelector(`.mobile-detail-block[data-detail-id="${id}"]`);
      if (!targetDetail) return;

      const isCurrentCardOpen = targetDetail === openDetailBlock;

      // 1. 既に何か開いている場合、現在のものを閉じる
      if (openDetailBlock) {
        openDetailBlock.classList.remove('is-open');
        if (openCardElement) {
          openCardElement.classList.remove('is-active-mobile');
        }
      }

      if (isCurrentCardOpen) {
        // 同じカードを再度クリックした場合: 閉じる処理だけで終了
        openDetailBlock = null;
        openCardElement = null;
        return;
      }

      // 2. 新しい詳細を開く
      targetDetail.classList.add('is-open');
      card.classList.add('is-active-mobile');

      // 状態変数を更新
      openDetailBlock = targetDetail;
      openCardElement = card;

      // スクロール調整
      const targetPosition = card.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: targetPosition - 20,
        behavior: 'smooth'
      });

    });
  });

  // =========================================================
  // IV. ウィンドウサイズ変更時のモバイル詳細要素のクリーンアップ
  // =========================================================
  window.addEventListener('resize', () => {
    if (window.innerWidth > MOBILE_BREAKPOINT) {
      // PCになったらモバイルの詳細をすべて閉じる
      detailBlocks.forEach(block => {
        block.classList.remove('is-open');
      });
      cards.forEach(card => {
        card.classList.remove('is-active-mobile');
      });

      // 状態変数をリセット
      openDetailBlock = null;
      openCardElement = null;
      container.classList.add('is-active');
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
 change
===================================================*/
document.addEventListener('DOMContentLoaded', () => {
  const storyControls = document.querySelector('.story-controls');
  const slider = document.querySelector('.story-slider');

  // PCビューではJSによるスライド処理をスキップ
  const isPC = () => window.innerWidth >= 768;

  if (storyControls && slider) {
    let isAfterActive = false;

    const updateSliderPosition = () => {
      if (isPC()) {
        slider.style.transform = 'translateX(0)';
      } else {
        if (isAfterActive) {
          slider.style.transform = 'translateX(-50%)';
        } else {
          slider.style.transform = 'translateX(0)';
        }
      }
    };

    // コントロールボタンのイベントリスナー設定
    storyControls.addEventListener('click', (e) => {
      if (isPC()) return;

      const targetButton = e.target.closest('.control-btn');
      if (!targetButton) return;

      document.querySelectorAll('.control-btn').forEach(btn => btn.classList.remove('active'));
      targetButton.classList.add('active');

      const target = targetButton.getAttribute('data-target');

      if (target === 'before') {
        slider.style.transform = 'translateX(0)';
        isAfterActive = false;
      } else if (target === 'after') {
        slider.style.transform = 'translateX(-50%)';
        isAfterActive = true;
      }
    });

    // 画面サイズ変更時にも位置を調整
    window.addEventListener('resize', updateSliderPosition);

    // 初期ロード時も位置を調整し、Beforeをアクティブにする
    updateSliderPosition();
    document.querySelector('.control-btn[data-target="before"]').click();
  }
});

/*=================================================
  achievements
===================================================*/
document.addEventListener("DOMContentLoaded", function () {
  let currentPage = 0;

  const pages = document.querySelectorAll(".student-page");
  const book = document.querySelector(".book-item");

  if (!pages.length || !book) return;

  // ▼ SP 判定（768px 以下）
  const isSP = window.innerWidth <= 768;

  // ▼ SP のときはページめくりを無効化（イベント付与しない）
  if (isSP) {
    return;
  }

  // ▼ PC のときだけページめくりの z-index をセット
  pages.forEach((page, i) => {
    page.style.zIndex = pages.length - i;
  });

  // ▼ ページをめくる関数（PC 専用）
  function flipNextPage() {
    const page = pages[currentPage];
    if (!page) return;

    page.classList.add("flip");

    // めくり終わったページを最背面へ移動
    setTimeout(() => {
      page.style.zIndex = 0;
    }, 2200);

    currentPage++;

    // 全ページめくり終わったらリセット
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

  // ▼ PC のみイベント追加（クリック・タッチ）
  book.addEventListener("click", flipNextPage);

  book.addEventListener("touchstart", function (e) {
    e.preventDefault();
    flipNextPage();
  });
});

/*=================================================
  teachers
===================================================*/

gsap.registerPlugin(ScrollTrigger);

window.addEventListener("load", () => {
  const lists = document.querySelectorAll(".teacher-list-area .list");
  const listArea = document.querySelector(".teacher-list-area");

  if (!lists.length) return;

  // SP/PC別の高さ
  const listHeight = window.innerWidth <= 768 ? 260 : 400;
  const pinDistance = lists.length * listHeight;

  // 初期状態
  gsap.set(lists, { opacity: 0, y: 100 });

  gsap.timeline({
    scrollTrigger: {
      trigger: listArea,
      start: "top top",
      end: "+=" + pinDistance,
      scrub: true,
      pin: listArea,
      pinSpacing: true,
      anticipatePin: 1
    }
  }).to(lists, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: 0.8
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
      if (scroll > target - windowHeight - 750) {
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

  if ($(this).scrollTop() > 1300) { // SPなら200px以上で表示
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




