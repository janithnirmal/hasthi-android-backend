@extends('layout.client-layout')
@section('title', 'Sign In Page')

@section('custom_css_js')
    @vite('resources/css/signin.css')
    @vite('resources/js/pages/client/signin.js')
@endsection

@section('content')
<!-- Sign In -->
<section class="loading-section d-none">
    <div class="loading-image-div">
        <img src="{{ asset('/storage/images/branding/logo-dark-v2.png') }}" alt="">
        <div class="loading"></div>
    </div>
</section>
<section class="vh-85">
    <div class="container py-5 h-100">
        <div class="row d-flex align-items-center justify-content-center h-100 py-5">
            <div class="col-md-7 col-lg-4 col-xl-4 lrv-border lrv-border-primary-700 rounded-top-right rounded-bottom-left lrv-bg-primary-100 p-4 mb-5">
                <form id="signInForm">
                    <!-- Headlines -->
                    <div class="col-12 d-flex flex-column mb-4">
                        <label class="main-title mt-2 mb-2 text-center lrv-font-cormorant-garamond lrv-fw-semibold lrv-text-primary-800">Sign In</label>
                        <label class="sub-text text-center mb-3 lrv-font-poppins">New to this site?
                            <a href="/signup" class="text-decoration-none lrv-font-poppins lrv-text-primary-500">Sign Up</a>
                        </label>
                    </div>

                    <!-- Email input -->
                    <div class="mb-4">
                        <input value="user@gmail.com" type="email" name="email" autocomplete="email" id="email" class="lrv-form-input w-100 item-rounded shadow-none " placeholder="Email Address" />
                    </div>

                    <!-- Password input -->
                    <div class="d-flex flex-row lrv-border lrv-rounded-pill mb-3">
                        <input value="User@123" type="password" name="password" id="password" autocomplete="current-password" class="lrv-form-input border-0" placeholder="Password" />
                        <span id="showPasswordBtn" class="input-group-text bg-transparent border-0"><i class="fa-solid fa-eye-slash"></i></span>
                    </div>

                    <!-- User Options -->
                    <div class="row mt-3 mb-4">
                        <div class="col-lg-6 col-6">
                            <div class="lrv-form-check ps-0">
                                <input class="lrv-form-check-input" type="checkbox" id="rememberMe" name="rememberMe"/>
                                <label class="lrv-form-check-label checkbox-label lrv-font-poppins sub-text" for="rememberMe">Remember Me</label>
                            </div>
                        </div>
                        <div class="col-lg-6 col-6 text-end">
                            <a href="forgot-password" class="text-decoration-none lrv-font-poppins lrv-text-primary-500 sub-text">Forgot Password?</a>
                        </div>
                    </div>

                    <!-- Submit button -->
                    <button type="button" id="signInBtn" class="col-12 lrv-btn lrv-btn-primary d-grid item-rounded lrv-ff-primary sub-text">Sign In</button>
                </form>
            </div>
        </div>
    </div>
</section>
<!-- Sign In -->
@endsection