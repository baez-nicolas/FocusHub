import { Component, computed, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LangService } from '../services/lang.service';
import { NewsService } from '../services/news.service';

interface DashPlaylist {
  id: string;
  name: string;
  emoji: string;
  safeUrl: SafeResourceUrl;
}

interface PlaylistGroup {
  name: string;
  emoji: string;
  playlists: DashPlaylist[];
}

@Component({
  selector: 'app-dashboard',
  imports: [],
  template: `
    <div class="dash-wrapper">
      <section class="hero">
        <div class="hero-glow"></div>
        <div class="hero-inner">
          <h1 class="hero-title">
            <span class="t-focus">Focus</span><span class="t-hub">Hub</span>
          </h1>
          <p class="hero-sub">{{ tx().heroSub }}</p>
          <p class="hero-date">{{ currentDateTime() }}</p>
          <div class="hero-actions">
            <button class="hbtn hbtn-primary" (click)="navigate('/news')">
              <i class="bi bi-newspaper"></i> {{ tx().news }}
            </button>
            <button class="hbtn" (click)="navigate('/notes')">
              <i class="bi bi-journal-text"></i> {{ tx().notes }}
            </button>
            <button class="hbtn" (click)="navigate('/calculator')">
              <i class="bi bi-calculator"></i> {{ tx().calculator }}
            </button>
          </div>
        </div>
      </section>

      <div class="sections-wrap">
        <section class="dash-section">
          <div class="sec-hdr">
            <div class="sec-title">
              <i class="bi bi-newspaper"></i>
              {{ tx().latestNews }}
            </div>
            <button class="see-all" (click)="navigate('/news')">{{ tx().seeAll }}</button>
          </div>

          @if (newsService.loading() && !latestNews().length) {
            <div class="news-grid">
              <div class="news-card skel-card"></div>
              <div class="news-card skel-card"></div>
              <div class="news-card skel-card"></div>
            </div>
          } @else if (latestNews().length) {
            <div class="news-grid">
              @for (article of latestNews(); track article.id) {
                <div class="news-card" (click)="openUrl(article.webUrl)">
                  @if (article.thumbnail) {
                    <img
                      [src]="article.thumbnail"
                      class="n-img"
                      [alt]="article.webTitle"
                      loading="lazy"
                    />
                  } @else {
                    <div class="n-img n-img-ph">
                      <i class="bi bi-newspaper"></i>
                    </div>
                  }
                  <div class="n-body">
                    <span class="n-section">{{ article.sectionName }}</span>
                    <h3 class="n-title">{{ article.webTitle }}</h3>
                    @if (article.trailText) {
                      <p class="n-trail">{{ stripHtml(article.trailText) }}</p>
                    }
                  </div>
                </div>
              }
            </div>
          } @else if (!newsService.loading()) {
            <div class="empty-box">
              <i class="bi bi-newspaper"></i>
              <p>{{ tx().noNews }}</p>
            </div>
          }
        </section>

        <section class="dash-section">
          <div class="sec-hdr">
            <div class="sec-title">
              <i class="bi bi-spotify"></i>
              {{ tx().recommendedPlaylists }}
            </div>
            <button class="see-all" (click)="navigate('/music')">{{ tx().seeAll }}</button>
          </div>

          <div class="pl-groups">
            @for (group of playlistGroups; track group.name) {
              <div class="pl-card">
                <div class="pl-card-hdr">
                  <span>{{ group.emoji }} {{ group.name }}</span>
                </div>
                <div class="pl-tabs">
                  @for (pl of group.playlists; track pl.id; let i = $index) {
                    <button
                      class="pl-tab"
                      [class.active]="activeIdx[group.name] === i"
                      (click)="setActive(group.name, i)"
                    >
                      {{ pl.name }}
                    </button>
                  }
                </div>
                <iframe
                  [src]="group.playlists[activeIdx[group.name]].safeUrl"
                  frameborder="0"
                  allowtransparency="true"
                  allow="encrypted-media; autoplay; clipboard-write; fullscreen; picture-in-picture"
                  loading="lazy"
                  class="pl-iframe"
                ></iframe>
              </div>
            }
          </div>
        </section>

        <section class="dash-section">
          <div class="sec-hdr">
            <div class="sec-title">
              <i class="bi bi-heart-pulse"></i>
              {{ tx().stepsToday }}
            </div>
            <button class="see-all" (click)="navigate('/gym')">{{ tx().seeAll }}</button>
          </div>

          <div class="steps-widget">
            <div class="steps-stat-row">
              <div class="steps-stat">
                <div class="steps-stat-icon">👟</div>
                <div class="steps-stat-val">{{ todaySteps().toLocaleString() }}</div>
                <div class="steps-stat-label">{{ tx().stepsLabel }}</div>
              </div>
              <div class="steps-stat">
                <div class="steps-stat-icon">🔥</div>
                <div class="steps-stat-val">{{ todayKcal() }}</div>
                <div class="steps-stat-label">{{ tx().kcal }}</div>
              </div>
              <div class="steps-stat">
                <div class="steps-stat-icon">📍</div>
                <div class="steps-stat-val">{{ todayKm() }}</div>
                <div class="steps-stat-label">{{ tx().km }}</div>
              </div>
            </div>
            <div class="steps-progress-label">
              <span>{{ tx().progressLabel }}</span>
              <span class="steps-pct">{{ todayPct() }}%</span>
            </div>
            <div class="steps-bar-wrap">
              <div class="steps-bar" [style.width.%]="todayPct()"></div>
            </div>
            <div class="steps-goal-sub">
              {{ todaySteps().toLocaleString() }} / 10,000 {{ tx().stepsLabel }}
            </div>
            @if (todayAwards().length) {
              <div class="steps-awards-row">
                @for (award of todayAwards(); track award.steps) {
                  <div class="steps-award">
                    @if (award.img) {
                      <img [src]="award.img" [alt]="award.name" class="steps-award-img" />
                    } @else {
                      <span class="steps-award-medal">{{ award.medal }}</span>
                    }
                    <span class="steps-award-name">{{ award.name }}</span>
                  </div>
                }
              </div>
            }
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [
    `
      .dash-wrapper {
        width: 100%;
        min-width: 0;
      }

      .hero {
        position: relative;
        width: 100%;
        min-height: 320px;
        background: #0d0f1c;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        padding: 64px 24px;
      }

      .hero-glow {
        position: absolute;
        top: -80px;
        left: 50%;
        transform: translateX(-50%);
        width: 700px;
        height: 450px;
        background: radial-gradient(
          ellipse at center,
          rgba(99, 102, 241, 0.28) 0%,
          rgba(139, 92, 246, 0.14) 40%,
          transparent 70%
        );
        pointer-events: none;
      }

      .hero-inner {
        position: relative;
        z-index: 1;
        text-align: center;
        max-width: 680px;
        width: 100%;
      }

      @keyframes fadeSlideDown {
        from {
          opacity: 0;
          transform: translateY(-40px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes fadeUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .hero-title {
        font-size: clamp(46px, 9vw, 80px);
        font-weight: 900;
        letter-spacing: -3px;
        margin: 0 0 14px;
        line-height: 1;
        animation: fadeSlideDown 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
        animation-delay: 0.05s;
      }

      .t-focus {
        color: #ffffff;
      }

      .t-hub {
        color: #6366f1;
      }

      .hero-sub {
        color: rgba(255, 255, 255, 0.6);
        font-size: 16px;
        margin: 0 0 6px;
        font-weight: 400;
        animation: fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
        animation-delay: 0.45s;
      }

      .hero-date {
        color: rgba(255, 255, 255, 0.35);
        font-size: 13px;
        margin: 0 0 32px;
        animation: fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
        animation-delay: 0.7s;
      }

      .hero-actions {
        display: flex;
        gap: 10px;
        justify-content: center;
        flex-wrap: wrap;
        animation: fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
        animation-delay: 0.95s;
      }

      .hbtn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 11px 22px;
        border-radius: 8px;
        border: 1.5px solid rgba(255, 255, 255, 0.22);
        background: transparent;
        color: white;
        font-size: 14.5px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .hbtn:hover {
        background: rgba(255, 255, 255, 0.09);
        border-color: rgba(255, 255, 255, 0.4);
      }

      .hbtn-primary {
        background: #6366f1;
        border-color: #6366f1;
        box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4);
      }

      .hbtn-primary:hover {
        background: #4f46e5;
        border-color: #4f46e5;
        box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
      }

      .sections-wrap {
        max-width: 1200px;
        margin: 0 auto;
        padding: 40px 24px 56px;
        display: flex;
        flex-direction: column;
        gap: 52px;
      }

      .sec-hdr {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 18px;
      }

      .sec-title {
        font-size: 18px;
        font-weight: 800;
        color: #1e293b;
        display: flex;
        align-items: center;
        gap: 9px;
      }

      .sec-title i {
        font-size: 20px;
        color: #6366f1;
      }

      .see-all {
        background: none;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 6px 16px;
        font-size: 13px;
        font-weight: 600;
        color: #6366f1;
        cursor: pointer;
        transition: all 0.18s;
      }

      .see-all:hover {
        background: #eef2ff;
        border-color: #c7d2fe;
      }

      .news-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
      }

      .news-card {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 14px;
        overflow: hidden;
        cursor: pointer;
        transition: all 0.22s ease;
        display: flex;
        flex-direction: column;
      }

      .news-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
        border-color: #c7d2fe;
      }

      .n-img {
        width: 100%;
        height: 176px;
        object-fit: cover;
        display: block;
        flex-shrink: 0;
      }

      .n-img-ph {
        background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 36px;
        color: #94a3b8;
        height: 176px;
      }

      .n-body {
        padding: 14px 16px 18px;
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .n-section {
        font-size: 10.5px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1.2px;
        color: #6366f1;
        margin-bottom: 6px;
      }

      .n-title {
        font-size: 14.5px;
        font-weight: 700;
        color: #1e293b;
        margin: 0 0 8px;
        line-height: 1.45;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .n-trail {
        font-size: 13px;
        color: #64748b;
        margin: 0;
        line-height: 1.5;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .skel-card {
        height: 300px;
        background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
        background-size: 200% 100%;
        animation: shimmer 1.4s infinite;
        cursor: default;
      }

      @keyframes shimmer {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }

      .empty-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 36px;
        background: #f8fafc;
        border: 1px dashed #e2e8f0;
        border-radius: 12px;
        color: #94a3b8;
        font-size: 14px;
        text-align: center;
      }

      .empty-box i {
        font-size: 30px;
      }

      .empty-box p {
        margin: 0;
      }

      .pl-groups {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
      }

      .pl-card {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 16px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        transition: box-shadow 0.2s ease;
      }

      .pl-card:hover {
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.09);
      }

      .pl-card-hdr {
        padding: 14px 16px 12px;
        font-size: 14px;
        font-weight: 700;
        color: #1e293b;
        border-bottom: 1px solid #f1f5f9;
      }

      :host-context(.dark) .pl-card-hdr {
        color: #f1f5f9;
        border-bottom-color: #2d3748;
      }

      .pl-tabs {
        display: flex;
        gap: 6px;
        padding: 10px 12px;
        background: #f8fafc;
        border-bottom: 1px solid #f1f5f9;
        flex-wrap: wrap;
      }

      :host-context(.dark) .pl-tabs {
        background: #161d2c;
        border-bottom-color: #2d3748;
      }

      .pl-tab {
        padding: 5px 11px;
        font-size: 12px;
        font-weight: 600;
        border-radius: 20px;
        border: 1.5px solid #e2e8f0;
        background: white;
        color: #64748b;
        cursor: pointer;
        transition: all 0.15s;
        white-space: nowrap;
      }

      .pl-tab.active {
        background: #6366f1;
        border-color: #6366f1;
        color: white;
      }

      .pl-tab:not(.active):hover {
        border-color: #6366f1;
        color: #6366f1;
      }

      :host-context(.dark) .pl-tab {
        background: #1e2a3a;
        border-color: #2d3748;
        color: #9ca3af;
      }

      :host-context(.dark) .pl-tab.active {
        background: #6366f1;
        border-color: #6366f1;
        color: white;
      }

      .pl-iframe {
        width: 100%;
        height: 300px;
        display: block;
        border: none;
        flex: 1;
      }

      .pomodoro-widget {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(
          135deg,
          rgba(99, 102, 241, 0.95) 0%,
          rgba(139, 92, 246, 0.95) 100%
        );
        backdrop-filter: blur(16px);
        padding: 12px 20px;
        border-radius: 16px;
        border: 1.5px solid rgba(255, 255, 255, 0.25);
        box-shadow: 0 8px 32px rgba(99, 102, 241, 0.3);
        z-index: 1000;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        width: 160px;
      }

      .pomodoro-widget:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 40px rgba(99, 102, 241, 0.4);
        border-color: rgba(255, 255, 255, 0.35);
      }

      .pomodoro-icon {
        font-size: 24px;
        line-height: 1;
        flex-shrink: 0;
      }

      .pomodoro-content {
        display: flex;
        flex-direction: column;
        gap: 2px;
        flex: 1;
        min-width: 0;
      }

      .pomodoro-label {
        font-size: 9px;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.85);
        text-transform: uppercase;
        letter-spacing: 1px;
        line-height: 1;
      }

      .pomodoro-time {
        font-size: 20px;
        font-weight: 800;
        color: white;
        font-variant-numeric: tabular-nums;
        letter-spacing: -0.5px;
        line-height: 1;
      }

      @media (max-width: 1023px) {
        .news-grid,
        .pl-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      @media (max-width: 640px) {
        .hero {
          min-height: 260px;
          padding: 48px 20px;
        }

        .hero-sub {
          font-size: 14.5px;
        }

        .news-grid {
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .n-img,
        .n-img-ph {
          height: 90px;
        }

        .n-body {
          padding: 8px 8px 10px;
        }

        .n-section {
          display: none;
        }

        .n-trail {
          display: none;
        }

        .n-title {
          font-size: 11px;
          -webkit-line-clamp: 3;
          margin-bottom: 0;
        }

        .pl-grid {
          grid-template-columns: 1fr;
        }

        .pl-groups {
          display: flex;
          flex-direction: row;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          gap: 12px;
          padding-bottom: 8px;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }

        .pl-groups::-webkit-scrollbar {
          display: none;
        }

        .pl-card {
          flex: 0 0 82%;
          scroll-snap-align: start;
          min-width: 0;
        }

        .pl-card-hdr {
          padding: 12px 14px;
          font-size: 13px;
        }

        .pl-tabs {
          display: flex;
          padding: 8px 10px;
          gap: 6px;
          overflow-x: auto;
          flex-wrap: nowrap;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }

        .pl-tabs::-webkit-scrollbar {
          display: none;
        }

        .pl-tab {
          flex-shrink: 0;
          font-size: 11px;
          padding: 4px 10px;
        }

        .pl-iframe {
          display: block;
          height: 152px;
        }

        .sections-wrap {
          padding: 28px 16px 40px;
          gap: 40px;
        }

        .skel-card {
          height: 140px;
        }

        .steps-widget {
          padding: 16px 0;
          overflow: hidden;
        }

        .steps-stat-row {
          gap: 8px;
          margin-bottom: 16px;
          padding: 0 16px;
        }

        .steps-progress-label {
          padding: 0 16px;
        }

        .steps-bar-wrap {
          height: 8px;
          margin: 0 16px 8px;
        }

        .steps-goal-sub {
          padding: 0 16px;
        }

        .steps-stat-icon {
          font-size: 20px;
          margin-bottom: 4px;
        }

        .steps-stat-val {
          font-size: 18px;
        }

        .steps-stat-label {
          font-size: 10px;
        }

        .steps-awards-row {
          display: flex;
          flex-wrap: nowrap;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          gap: 10px;
          padding: 4px 16px 8px;
          margin-top: 10px;
        }

        .steps-awards-row::-webkit-scrollbar {
          display: none;
        }

        .steps-award {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          scroll-snap-align: start;
          gap: 6px;
          padding: 12px 8px;
          border-radius: 14px;
          width: 80px;
          min-width: 80px;
          max-width: 80px;
        }

        .steps-award-img {
          width: 38px;
          height: 38px;
        }

        .steps-award-medal {
          font-size: 28px;
          line-height: 1;
        }

        .steps-award-name {
          font-size: 10px;
          text-align: center;
          white-space: normal;
          line-height: 1.2;
        }
      }

      :host-context(.dark) .sec-title {
        color: #f1f5f9;
      }

      :host-context(.dark) .see-all {
        border-color: #2d3748;
        color: #a5b4fc;
      }

      :host-context(.dark) .see-all:hover {
        background: rgba(99, 102, 241, 0.1);
        border-color: #4338ca;
      }

      :host-context(.dark) .news-card {
        background: #1e2a3a;
        border-color: #2d3748;
      }

      :host-context(.dark) .news-card:hover {
        border-color: #4f46e5;
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
      }

      :host-context(.dark) .n-img-ph {
        background: linear-gradient(135deg, #1e2a3a, #2d3748);
        color: #64748b;
      }

      :host-context(.dark) .n-title {
        color: #f1f5f9;
      }

      :host-context(.dark) .n-trail {
        color: #94a3b8;
      }

      :host-context(.dark) .pl-card {
        background: #1e2a3a;
        border-color: #2d3748;
      }

      :host-context(.dark) .pl-card:hover {
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
      }

      :host-context(.dark) .pl-label {
        color: #f1f5f9;
        border-bottom-color: #2d3748;
      }

      :host-context(.dark) .empty-box {
        background: #1e2a3a;
        border-color: #2d3748;
        color: #64748b;
      }

      :host-context(.dark) .skel-card {
        background: linear-gradient(90deg, #1e2a3a 25%, #2d3748 50%, #1e2a3a 75%);
        background-size: 200% 100%;
      }

      .steps-widget {
        background: white;
        border-radius: 16px;
        padding: 24px;
        border: 1px solid #f3f4f6;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      }

      :host-context(.dark) .steps-widget {
        background: #1e2a3a;
        border-color: #2d3748;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
      }

      .steps-stat-row {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
        margin-bottom: 20px;
      }

      .steps-stat {
        text-align: center;
      }

      .steps-stat-icon {
        font-size: 24px;
        margin-bottom: 6px;
      }

      .steps-stat-val {
        font-size: 22px;
        font-weight: 800;
        color: #6366f1;
        letter-spacing: -0.5px;
        line-height: 1;
        margin-bottom: 4px;
      }

      :host-context(.dark) .steps-stat-val {
        color: #818cf8;
      }

      .steps-stat-label {
        font-size: 11px;
        font-weight: 600;
        color: #9ca3af;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .steps-progress-label {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        font-size: 13px;
        font-weight: 600;
        color: #6b7280;
      }

      :host-context(.dark) .steps-progress-label {
        color: #9ca3af;
      }

      .steps-pct {
        font-size: 15px;
        font-weight: 800;
        color: #6366f1;
      }

      :host-context(.dark) .steps-pct {
        color: #818cf8;
      }

      .steps-bar-wrap {
        background: #f3f4f6;
        border-radius: 100px;
        height: 10px;
        overflow: hidden;
        margin-bottom: 8px;
      }

      :host-context(.dark) .steps-bar-wrap {
        background: #252b3b;
      }

      .steps-bar {
        height: 100%;
        background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%);
        border-radius: 100px;
        transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        max-width: 100%;
      }

      .steps-goal-sub {
        font-size: 12px;
        color: #9ca3af;
        font-weight: 600;
        text-align: right;
      }

      .steps-awards-row {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 14px;
      }

      .steps-award {
        display: flex;
        align-items: center;
        gap: 7px;
        padding: 6px 10px;
        background: linear-gradient(
          135deg,
          rgba(245, 158, 11, 0.1) 0%,
          rgba(251, 191, 36, 0.1) 100%
        );
        border: 1.5px solid rgba(245, 158, 11, 0.35);
        border-radius: 20px;
      }

      .steps-award-img {
        width: 26px;
        height: 26px;
        object-fit: cover;
        border-radius: 50%;
        border: 2px solid rgba(245, 158, 11, 0.5);
        flex-shrink: 0;
      }

      .steps-award-medal {
        font-size: 18px;
        line-height: 1;
      }

      .steps-award-name {
        font-size: 11px;
        font-weight: 700;
        color: #92400e;
        white-space: nowrap;
      }

      :host-context(.dark) .steps-award {
        background: rgba(245, 158, 11, 0.08);
        border-color: rgba(245, 158, 11, 0.25);
      }

      :host-context(.dark) .steps-award-name {
        color: #fcd34d;
      }
    `,
  ],
})
export class DashboardComponent {
  newsService = inject(NewsService);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);
  private langService = inject(LangService);

  readonly tx = computed(() => {
    const es = this.langService.lang() === 'es';
    return {
      heroSub: es
        ? 'Tu hub de productividad — Noticias, Notas y más'
        : 'Your productivity hub — News, Notes & More',
      news: es ? 'Noticias' : 'News',
      notes: es ? 'Notas' : 'Notes',
      calculator: es ? 'Calculadora' : 'Calculator',
      latestNews: es ? 'Últimas Noticias' : 'Latest News',
      seeAll: es ? 'Ver todo' : 'See all',
      noNews: es ? 'Sin noticias disponibles' : 'No news available',
      recommendedPlaylists: es ? 'Playlists Recomendadas' : 'Recommended Playlists',
      stepsToday: es ? 'Actividad del día' : "Today's Activity",
      stepsLabel: es ? 'Pasos' : 'Steps',
      kcal: es ? 'Kcal' : 'Kcal',
      km: es ? 'Km' : 'Km',
      progressLabel: es ? 'Progreso hacia 10K pasos' : 'Progress to 10K steps',
      days: es
        ? ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
        : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      months: es
        ? [
            'enero',
            'febrero',
            'marzo',
            'abril',
            'mayo',
            'junio',
            'julio',
            'agosto',
            'septiembre',
            'octubre',
            'noviembre',
            'diciembre',
          ]
        : [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ],
    };
  });

  activeIdx: Record<string, number> = { 'Focus Flow': 0, 'Lo-Fi': 0, 'Beast Mode': 0 };

  setActive(group: string, idx: number): void {
    this.activeIdx = { ...this.activeIdx, [group]: idx };
  }

  playlistGroups: PlaylistGroup[] = [
    {
      name: 'Focus Flow',
      emoji: '🎯',
      playlists: [
        {
          id: '37i9dQZF1DWZeKCadgRdKQ',
          name: 'Focus Flow',
          emoji: '🎯',
          safeUrl: this.sanitizer.bypassSecurityTrustResourceUrl(
            'https://open.spotify.com/embed/playlist/37i9dQZF1DWZeKCadgRdKQ?utm_source=generator',
          ),
        },
        {
          id: '37i9dQZF1DWXLeA8Omikj7',
          name: 'Brain Food',
          emoji: '🧠',
          safeUrl: this.sanitizer.bypassSecurityTrustResourceUrl(
            'https://open.spotify.com/embed/playlist/37i9dQZF1DWXLeA8Omikj7?utm_source=generator',
          ),
        },
        {
          id: '37i9dQZF1DX3rxVfibe1L0',
          name: 'Mood Booster',
          emoji: '🎹',
          safeUrl: this.sanitizer.bypassSecurityTrustResourceUrl(
            'https://open.spotify.com/embed/playlist/37i9dQZF1DX3rxVfibe1L0?utm_source=generator',
          ),
        },
      ],
    },
    {
      name: 'Lo-Fi',
      emoji: '🌙',
      playlists: [
        {
          id: '37i9dQZF1DWWQRwui0ExPn',
          name: 'Lo-Fi Beats',
          emoji: '🌙',
          safeUrl: this.sanitizer.bypassSecurityTrustResourceUrl(
            'https://open.spotify.com/embed/playlist/37i9dQZF1DWWQRwui0ExPn?utm_source=generator',
          ),
        },
        {
          id: '37i9dQZF1DX4sWSpwq3LiO',
          name: 'Peaceful Piano',
          emoji: '🎹',
          safeUrl: this.sanitizer.bypassSecurityTrustResourceUrl(
            'https://open.spotify.com/embed/playlist/37i9dQZF1DX4sWSpwq3LiO?utm_source=generator',
          ),
        },
        {
          id: '37i9dQZF1DWZd79rJ6a7lp',
          name: 'Sleep',
          emoji: '🛌',
          safeUrl: this.sanitizer.bypassSecurityTrustResourceUrl(
            'https://open.spotify.com/embed/playlist/37i9dQZF1DWZd79rJ6a7lp?utm_source=generator',
          ),
        },
      ],
    },
    {
      name: 'Beast Mode',
      emoji: '💪',
      playlists: [
        {
          id: '37i9dQZF1DX2ENAPP1Tyed',
          name: 'Workout',
          emoji: '💪',
          safeUrl: this.sanitizer.bypassSecurityTrustResourceUrl(
            'https://open.spotify.com/embed/playlist/37i9dQZF1DX2ENAPP1Tyed?utm_source=generator',
          ),
        },
        {
          id: '37i9dQZF1DWXRqgorJj26U',
          name: 'Rock Classics',
          emoji: '🎸',
          safeUrl: this.sanitizer.bypassSecurityTrustResourceUrl(
            'https://open.spotify.com/embed/playlist/37i9dQZF1DWXRqgorJj26U?utm_source=generator',
          ),
        },
        {
          id: '37i9dQZF1DX76Wlfdnj7AP',
          name: 'Power Hour',
          emoji: '⚡',
          safeUrl: this.sanitizer.bypassSecurityTrustResourceUrl(
            'https://open.spotify.com/embed/playlist/37i9dQZF1DX76Wlfdnj7AP?utm_source=generator',
          ),
        },
      ],
    },
  ];

  latestNews = computed(() => this.newsService.articles().slice(0, 3));

  private stepRecords = computed<{ date: string; steps: number }[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('step-records') ?? '[]');
    } catch {
      return [];
    }
  });

  todaySteps = computed(() => {
    const t = new Date().toISOString().split('T')[0];
    return this.stepRecords().find((r) => r.date === t)?.steps ?? 0;
  });

  todayKcal = computed(() => Math.round(this.todaySteps() * 0.04));
  todayKm = computed(() => (this.todaySteps() * 0.00075).toFixed(2));
  todayPct = computed(() => Math.min(100, Math.round((this.todaySteps() / 10000) * 100)));

  todayAwards = computed(() => {
    const steps = this.todaySteps();
    const es = this.langService.lang() === 'es';
    const all: { steps: number; img?: string; medal?: string; name: string }[] = [
      { steps: 2500, medal: '🥉', name: es ? 'Bronce' : 'Bronze' },
      { steps: 5000, medal: '🥈', name: es ? 'Plata' : 'Silver' },
      { steps: 7500, medal: '🥇', name: es ? 'Oro' : 'Gold' },
      { steps: 10000, img: 'assets/leomessi.png', name: es ? '¡Como Messi!' : 'Like Messi!' },
      { steps: 15000, img: 'assets/prime.png', name: es ? 'Eres un Prime' : "You're a Prime" },
      { steps: 20000, img: 'assets/midoriya.webp', name: 'One for All' },
      { steps: 25000, img: 'assets/kratos.png', name: es ? 'Dios de la Guerra' : 'God of War' },
      { steps: 30000, img: 'assets/alienx.png', name: 'Alien X' },
      { steps: 35000, img: 'assets/goku.png', name: es ? 'Super Saiyan' : 'Super Saiyan' },
    ];
    return all.filter((a) => steps >= a.steps);
  });

  currentDateTime = computed(() => {
    const now = new Date();
    const { days, months } = this.tx();
    const es = this.langService.lang() === 'es';
    if (es) {
      return `${days[now.getDay()]}, ${now.getDate()} de ${months[now.getMonth()]} de ${now.getFullYear()}`;
    }
    return `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
  });

  navigate(path: string): void {
    this.router.navigate([path]);
  }

  openUrl(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '');
  }
}
