import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';

import { BannerComponent } from 'src/app/core/components/banner/banner.component';
import { HeaderComponent } from 'src/app/core/components/header/header.component';
import { MovieCarouselComponent } from 'src/app/shared/components/movie-carousel/movie-carousel.component';
import { IVideoContent } from 'src/app/shared/models/video-content.interface';
import { MovieService } from 'src/app/shared/services/movie.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    BannerComponent,
    MovieCarouselComponent,
  ],
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss'],
})
export class BrowseComponent implements OnInit {
  authService = inject(AuthService);
  movieService = inject(MovieService);

  userInfo = JSON.parse(sessionStorage.getItem('loggedInUser')!);
  bannerDetail$ = new Observable<any>();
  bannerVideo$ = new Observable<any>();

  movies: IVideoContent[] = [];
  tvShows: IVideoContent[] = [];
  ratedMovies: IVideoContent[] = [];
  nowPlayingMovies: IVideoContent[] = [];
  popularMovies: IVideoContent[] = [];
  topRatedMovies: IVideoContent[] = [];
  upcomingMovies: IVideoContent[] = [];

  sources = [
    this.movieService.getMovies(),
    this.movieService.getTvShows(),
    this.movieService.getNowPlayingMovies(),
    this.movieService.getUpcomingMovies(),
    this.movieService.getPopularMovies(),
    this.movieService.getTopRated(),
  ];

  ngOnInit(): void {
    forkJoin(this.sources)
      .pipe(
        map(([movies, tvShows, nowPlaying, upcoming, popular, topRated]) => {
          this.bannerDetail$ = this.movieService.getBannerDetail(
            movies.results[0].id
          );
          this.bannerVideo$ = this.movieService.getBannerVideo(
            movies.results[0].id
          );
          return {
            movies,
            tvShows,
            nowPlaying,
            upcoming,
            popular,
            topRated,
          };
        })
      )
      .subscribe((res: any) => {
        this.movies = res.movies.results as IVideoContent[];
        this.tvShows = res.tvShows.results as IVideoContent[];
        this.nowPlayingMovies = res.nowPlaying.results as IVideoContent[];
        this.upcomingMovies = res.upcoming.results as IVideoContent[];
        this.popularMovies = res.popular.results as IVideoContent[];
        this.topRatedMovies = res.topRated.results as IVideoContent[];
      });
  }

  signOut() {
    this.authService.signOut();
    sessionStorage.removeItem('loggedInUser');
  }
}
