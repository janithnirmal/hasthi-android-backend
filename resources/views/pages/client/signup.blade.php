@extends('layout.client-layout')
@section('title', 'Sign Up Page')

@section('external_css')
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/intl-tel-input@21.1.1/build/css/intlTelInput.css" />
@endsection

@section('external_js')
    <script defer src="https://cdn.jsdelivr.net/npm/intl-tel-input@21.1.1/build/js/intlTelInput.min.js"></script>
@endsection

@section('custom_css_js')
    @vite('resources/css/signup.css')
    @vite('resources/js/pages/client/signup.js')
@endsection

@section('content')
<section class="m-0 py-5 pt-3" id="su-s1">
    <div class="position-fixed top-0 start-0 w-100" style="z-index: 9999;">
        <div id="toast-container2" class="toast-container"></div>
    </div>
    <div class="col-md-7 col-lg-4 col-xl-4 lrv-border py-4 lrv-border-primary-700 rounded-top-right rounded-bottom-left lrv-bg-primary-100 container d-flex justify-content-center align-items-center" id="su-s1-c">
        <div class="row gy-2">
            <div class="col-12 d-flex justify-content-center align-items-center">
                <div class="row gy-1">
                    <h1 class="lrv-fs-3 lrv-text-primary-800 lrv-font-cormorant-garamond lrv-fw-semibold text-center">Sign Up</h1>
                    <p class="lrv-text-dark text-center su-s1-txt1">Already a member? <a class=" lrv-text-primary-500 text-decoration-none" href="signin">Sign In</a></p>
                </div>
            </div>
            <div id="signUpForm" class="offset-1 col-10 d-flex justify-content-center align-items-center">
                <div class="row g-3 su-s1-wrapper">
                    <input type="text" id="firstName" name="first_name" class="su-s1-ipt lrv-form-input lrv-border lrv-rounded-pill" placeholder="First Name" />
                    <input type="text" id="lastName" name="last_name" class="su-s1-ipt lrv-form-input lrv-border lrv-rounded-pill" placeholder="Last Name" />
                    <input type="email" id="email" name="email" class="su-s1-ipt lrv-form-input lrv-border lrv-rounded-pill" placeholder="Email Address" />
                    <div class="d-flex flex-row lrv-border lrv-rounded-pill px-0 su-s1-ipt-wrapper" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Password must be 8-20 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.">
                        <input type="password" id="password" name="password" class="su-s1-ipt lrv-form-input border-0" placeholder="Password" />
                        <span id="showPasswordBtn" class="input-group-text bg-transparent border-0"><i class="fa-solid fa-eye-slash"></i></span>
                    </div>
                    <input type="tel" id="su-s1-ipt-mn" name="mobile" class="su-s1-ipt lrv-form-input lrv-border w-100 lrv-rounded-pill" placeholder="Mobile Number" />
                    <button id="signUpBtn" class="lrv-btn lrv-btn-primary lrv-rounded-pill p-2 text-center su-s1-txt2">SignUp</button>
                </div>
            </div>
        </div>
    </div>
    <div class="col-md-7 col-lg-7 col-xl-6 container d-flex justify-content-center">
        <div id="toast-container1" class="toast-container"></div>
    </div>
</section>
@endsection