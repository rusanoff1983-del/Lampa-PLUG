(function () {
  'use strict';

  /* ================================================================
   *  Card Zoom Effect Plugin for Lampa
   *  Плавное увеличение постера внутри карточки при фокусе
   *  + опция отключения белой рамки
   * ================================================================ */

  function injectCSS() {
    var scale = Lampa.Storage.get('zoom_scale', '1.08');
    var duration = Lampa.Storage.get('zoom_duration', '0.3s');
    var radius = Lampa.Storage.get('zoom_radius', '8px');
    var removeBorder = Lampa.Storage.get('zoom_remove_border', false);

    var css = `
    /* Карточка и view остаются на месте с обрезкой */
    .card,
    .poster,
    .selector {
      border-radius: ${radius} !important;
    }

    .card__view,
    .poster__view {
      overflow: visible !important;
      border-radius: ${radius} !important;
      transition: transform ${duration} cubic-bezier(0.2, 0.9, 0.2, 1) !important;
      transform-origin: center center !important;
    }

    /* При фокусе увеличивается весь view вместе с картинкой */
    .card.focus .card__view,
    .poster.focus .poster__view {
      transform: scale(${scale}) !important;
      z-index: 10 !important;
    }
    `;

    // Если включено удаление обводки
    if (removeBorder) {
      css += `
    /* рамка через псевдоэлементы */
    .card.focus .card__view::before,
    .card.focus .card__view::after,
    .selector.focus .card__view::before,
    .selector.focus .card__view::after {
      display: none !important;
      content: none !important;
      border: 0 !important;
      box-shadow: none !important;
    }

    /* на всякий — если где-то ещё border */
    .card.focus .card__view,
    .selector.focus .card__view {
      border: 0 !important;
      outline: 0 !important;
      box-shadow: none !important;
    }
      `;
    }

    var styleId = 'card-zoom-plugin-css';
    var existingStyle = document.getElementById(styleId);
    
    if (existingStyle) {
      existingStyle.textContent = css;
    } else {
      var style = document.createElement('style');
      style.id = styleId;
      style.textContent = css;
      document.head.appendChild(style);
    }
  }

  function initSettings() {
    var lang = Lampa.Storage.get('language', 'ru');

    var i18n = {
      'en': {
        'zoom_title': 'Card Zoom Effect',
        'zoom_scale': 'Zoom Scale',
        'zoom_duration': 'Animation Speed',
        'zoom_radius': 'Corner Radius',
        'zoom_remove_border': 'Remove White Border',
        'none': 'None',
        'tiny': 'Tiny (1.03x)',
        'small': 'Small (1.05x)',
        'medium': 'Medium (1.08x)',
        'large': 'Large (1.12x)',
        'xlarge': 'Extra Large (1.15x)',
        'very_fast': 'Very Fast (0.15s)',
        'fast': 'Fast (0.2s)',
        'normal': 'Normal (0.3s)',
        'slow': 'Slow (0.5s)',
        'very_slow': 'Very Slow (0.8s)',
        'ultra_slow': 'Ultra Slow (1.2s)',
        'super_slow': 'Super Slow (1.5s)',
        'mega_slow': 'Mega Slow (2.0s)',
        'r_none': 'Square (0px)',
        'r_small': 'Small (4px)',
        'r_medium': 'Medium (8px)',
        'r_large': 'Large (12px)',
        'r_xlarge': 'X-Large (16px)',
        'r_xxlarge': 'XX-Large (24px)'
      },
      'ru': {
        'zoom_title': 'Увеличение Карточек',
        'zoom_scale': 'Масштаб увеличения',
        'zoom_duration': 'Скорость анимации',
        'zoom_radius': 'Закругление углов',
        'zoom_remove_border': 'Выключить обводку',
        'none': 'Отключено',
        'tiny': 'Минимальное (1.03x)',
        'small': 'Малое (1.05x)',
        'medium': 'Среднее (1.08x)',
        'large': 'Большое (1.12x)',
        'xlarge': 'Очень большое (1.15x)',
        'very_fast': 'Очень быстро (0.15s)',
        'fast': 'Быстро (0.2s)',
        'normal': 'Нормально (0.3s)',
        'slow': 'Медленно (0.5s)',
        'very_slow': 'Очень медленно (0.8s)',
        'ultra_slow': 'Ультра медленно (1.2s)',
        'super_slow': 'Супер медленно (1.5s)',
        'mega_slow': 'Мега медленно (2.0s)',
        'r_none': 'Квадратные (0px)',
        'r_small': 'Малые (4px)',
        'r_medium': 'Средние (8px)',
        'r_large': 'Большие (12px)',
        'r_xlarge': 'Очень большие (16px)',
        'r_xxlarge': 'Максимальные (24px)'
      },
      'uk': {
        'zoom_title': 'Збільшення Карток',
        'zoom_scale': 'Масштаб збільшення',
        'zoom_duration': 'Швидкість анімації',
        'zoom_radius': 'Заокруглення кутів',
        'zoom_remove_border': 'Вимкнути обводку',
        'none': 'Вимкнено',
        'tiny': 'Мінімальне (1.03x)',
        'small': 'Мале (1.05x)',
        'medium': 'Середнє (1.08x)',
        'large': 'Велике (1.12x)',
        'xlarge': 'Дуже велике (1.15x)',
        'very_fast': 'Дуже швидко (0.15s)',
        'fast': 'Швидко (0.2s)',
        'normal': 'Нормально (0.3s)',
        'slow': 'Повільно (0.5s)',
        'very_slow': 'Дуже повільно (0.8s)',
        'ultra_slow': 'Ультра повільно (1.2s)',
        'super_slow': 'Супер повільно (1.5s)',
        'mega_slow': 'Мега повільно (2.0s)',
        'r_none': 'Квадратні (0px)',
        'r_small': 'Малі (4px)',
        'r_medium': 'Середні (8px)',
        'r_large': 'Великі (12px)',
        'r_xlarge': 'Дуже великі (16px)',
        'r_xxlarge': 'Максимальні (24px)'
      }
    };

    function t(key) {
      var dict = i18n[lang] || i18n['ru'];
      return dict[key] || i18n['en'][key] || key;
    }

    // Добавляем компонент в настройки
    Lampa.SettingsApi.addComponent({
      component: 'card_zoom_plugin',
      name: t('zoom_title'),
      icon: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9l6 6m0-6l-6 6"/></svg>'
    });

    // Масштаб увеличения
    Lampa.SettingsApi.addParam({
      component: 'card_zoom_plugin',
      param: {
        name: 'zoom_scale',
        type: 'select',
        default: '1.08',
        values: {
          '1.0': t('none'),
          '1.03': t('tiny'),
          '1.05': t('small'),
          '1.08': t('medium'),
          '1.12': t('large'),
          '1.15': t('xlarge')
        }
      },
      field: {
        name: t('zoom_scale')
      },
      onChange: function () {
        injectCSS();
      }
    });

    // Скорость анимации
    Lampa.SettingsApi.addParam({
      component: 'card_zoom_plugin',
      param: {
        name: 'zoom_duration',
        type: 'select',
        default: '0.3s',
        values: {
          '0.15s': t('very_fast'),
          '0.2s': t('fast'),
          '0.3s': t('normal'),
          '0.5s': t('slow'),
          '0.8s': t('very_slow'),
          '1.2s': t('ultra_slow'),
          '1.5s': t('super_slow'),
          '2.0s': t('mega_slow')
        }
      },
      field: {
        name: t('zoom_duration')
      },
      onChange: function () {
        injectCSS();
      }
    });

    // Закругление углов
    Lampa.SettingsApi.addParam({
      component: 'card_zoom_plugin',
      param: {
        name: 'zoom_radius',
        type: 'select',
        default: '8px',
        values: {
          '0px': t('r_none'),
          '4px': t('r_small'),
          '8px': t('r_medium'),
          '12px': t('r_large'),
          '16px': t('r_xlarge'),
          '24px': t('r_xxlarge')
        }
      },
      field: {
        name: t('zoom_radius')
      },
      onChange: function () {
        injectCSS();
      }
    });

    // Выключить белую обводку
    Lampa.SettingsApi.addParam({
      component: 'card_zoom_plugin',
      param: {
        name: 'zoom_remove_border',
        type: 'trigger',
        default: false
      },
      field: {
        name: t('zoom_remove_border')
      },
      onChange: function () {
        injectCSS();
      }
    });
  }

  function bootstrap() {
    if (window.__card_zoom_plugin_loaded) return;
    window.__card_zoom_plugin_loaded = true;

    initSettings();
    injectCSS();

    // Слушаем изменения настроек
    if (window.Lampa && Lampa.Storage && Lampa.Storage.listener) {
      Lampa.Storage.listener.follow('change', function (e) {
        if (e.name && (e.name === 'zoom_scale' || e.name === 'zoom_duration' || e.name === 'zoom_radius' || e.name === 'zoom_remove_border')) {
          injectCSS();
        }
      });
    }

    console.log('[Card Zoom Plugin] v1.1 — Loaded (with border removal option)');
  }

  // Инициализация
  if (window.Lampa && Lampa.Listener) {
    Lampa.Listener.follow('app', function (e) {
      if (e.type === 'ready') bootstrap();
    });
    setTimeout(bootstrap, 800);
  } else {
    var poll = setInterval(function () {
      if (typeof Lampa !== 'undefined' && Lampa.Listener) {
        clearInterval(poll);
        Lampa.Listener.follow('app', function (e) {
          if (e.type === 'ready') bootstrap();
        });
        setTimeout(bootstrap, 800);
      }
    }, 200);
  }

})();
