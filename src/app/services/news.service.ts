import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { LangService } from './lang.service';

export interface NewsArticle {
  id: string;
  sectionName: string;
  webPublicationDate: string;
  webTitle: string;
  webUrl: string;
  thumbnail?: string;
  trailText?: string;
}

interface GuardianResponse {
  response: {
    status: string;
    total: number;
    currentPage: number;
    pages: number;
    results: GuardianResult[];
  };
}

interface GuardianResult {
  id: string;
  sectionName: string;
  webPublicationDate: string;
  webTitle: string;
  webUrl: string;
  fields?: {
    thumbnail?: string;
    trailText?: string;
  };
}

@Injectable({ providedIn: 'root' })
export class NewsService {
  private http = inject(HttpClient);
  private lang = inject(LangService);
  private readonly apiKey = '9658f686-0f2b-443e-9840-7eec2e479fc4';
  private readonly baseUrl = 'https://content.guardianapis.com/search';

  articles = signal<NewsArticle[]>([]);
  loading = signal(false);
  footerReady = signal(false);
  error = signal<string | null>(null);
  totalPages = signal(0);
  currentPage = signal(1);
  currentQuery = signal('');
  currentSection = signal('');

  readonly sections = computed(() => {
    const es = this.lang.lang() === 'es';
    return [
      { value: '', label: es ? 'Todo' : 'All' },
      { value: 'world', label: es ? 'Mundo' : 'World' },
      { value: 'technology', label: es ? 'Tecnología' : 'Technology' },
      { value: 'science', label: es ? 'Ciencia' : 'Science' },
      { value: 'sport', label: es ? 'Deporte' : 'Sport' },
      { value: 'business', label: es ? 'Negocios' : 'Business' },
      { value: 'culture', label: es ? 'Cultura' : 'Culture' },
      { value: 'environment', label: es ? 'Medioambiente' : 'Environment' },
      { value: 'health', label: es ? 'Salud' : 'Health' },
    ];
  });

  fetchNews(query: string = '', section: string = '', page: number = 1): void {
    this.loading.set(true);
    this.error.set(null);
    this.currentQuery.set(query);
    this.currentSection.set(section);
    this.currentPage.set(page);

    let params = new HttpParams()
      .set('api-key', this.apiKey)
      .set('show-fields', 'thumbnail,trailText')
      .set('page-size', '20')
      .set('page', page.toString())
      .set('order-by', 'newest');

    if (query.trim()) {
      params = params.set('q', query.trim());
    }

    if (section) {
      params = params.set('section', section);
    }

    this.http
      .get<GuardianResponse>(this.baseUrl, { params })
      .pipe(
        map((res) => res.response),
        catchError(() => {
          this.error.set('No se pudo cargar las noticias. Intentá de nuevo.');
          this.loading.set(false);
          this.footerReady.set(true);
          return of(null);
        }),
      )
      .subscribe((data) => {
        if (!data) return;
        this.articles.set(
          data.results.map((r) => ({
            id: r.id,
            sectionName: r.sectionName,
            webPublicationDate: r.webPublicationDate,
            webTitle: r.webTitle,
            webUrl: r.webUrl,
            thumbnail: r.fields?.thumbnail,
            trailText: r.fields?.trailText,
          })),
        );
        this.totalPages.set(data.pages);
        this.loading.set(false);
        this.footerReady.set(true);
      });
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.fetchNews(this.currentQuery(), this.currentSection(), this.currentPage() + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.fetchNews(this.currentQuery(), this.currentSection(), this.currentPage() - 1);
    }
  }
}
