@extends('layout.client-layout')
@section('title', 'About')

@section('custom_css_js')
    @vite('resources/css/about.css')
@endsection

@section('content')

    <!-- s1 - section 1 -->
    <section class="aup-s1 lrv-bg-secondary-800 py-5 d-flex">
        <div class="container p-0 flex-grow-1 d-flex align-items-center justify-content-center">
            <h1 class="text-center lrv-text-primary-100">About Page 🔮</h1>
        </div>
    </section>

@endsection
