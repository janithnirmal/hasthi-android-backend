@extends('layout.client-layout')
@section('title', 'Home')

@section('external_css')
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
@endsection

@section('external_js')
    <script defer src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
@endsection

@section('custom_css_js')
    @vite('resources/css/home.css')
    @vite('resources/js/pages/client/home.js')
@endsection



@section('content')

    <!-- s1 - section 1 -->
    <section class="aup-s1 lrv-bg-secondary-800 py-5 d-flex">
        <div class="container p-0 flex-grow-1 d-flex align-items-center justify-content-center">
            <h1 class="text-center lrv-text-primary-100">Home Page 🏠</h1>
        </div>
    </section>

@endsection
