@extends('layout.admin-layout')
@section('title', 'Laravania | Admin | Log In')
@isCustomPage(true)


@section('custom_css_js')
    @vite('resources/css/admin_login.css')
    @vite('resources/js/pages/admin/admin_login.js')
@endsection


@section('content')
    <!-- Admin Sign In -->
    <section class="p-0 lrv-bg-secondary-600 lrv-text-primary-100">
        <div class="container-fluid">
            <div class="row">
                <!-- Side Image -->
                <div class=" col-6 d-none d-lg-block p-0">
                    <div class="img-div"></div>
                </div>

                <div class="col-lg-6 col-12 mb-5 mb-lg-0">
                    <div class="row d-flex align-items-center justify-content-center vh-100 p-lg-4 p-sm-5">
                        <form class="p-lg-5 col-lg-10" id="adminLoginForm">
                            <div class="col-12 d-flex flex-column mb-4">
                                <!-- Greetings -->
                                <label
                                    class="h1 mt-2 mb-0 text-center lrv-font-cormorant-garamond lrv-fw-bold">Welcome</label>
                                <label class="h2 mb-2 mt-0 text-center lrv-font-cormorant-garamond lrv-fw-bold">Admin Sign
                                    In</label>
                                <label class="lrv-font-poppins text-center mb-3 sub-text">Enter Your Details For
                                    Login</label>
                                <!-- Greetings -->
                            </div>
                            <!-- Email input -->
                            <div class="form-outline mb-4">
                                <input type="email" value="admin@gmail.com" id="email" name="email"
                                    class="lrv-form-input item-rounded shadow-none w-100" placeholder="Email Address" />
                            </div>

                            <!-- Password input -->
                            <div class="d-flex flex-row lrv-border lrv-rounded-pill mb-4">
                                <input type="password" value="Admin@123" id="password" name="password"
                                    class="lrv-form-input border-0 " placeholder="Password" />
                                <span id="showPasswordBtn" class="input-group-text bg-transparent border-0"><i
                                        class="fa-solid fa-eye-slash"></i></span>
                            </div>


                            <!-- User Options -->
                            <div class="row mb-4">
                                <div class="col-6">
                                    <div class="lrv-form-check ps-0">
                                        <input class="check-box lrv-form-check-input shadow-none" type="checkbox"
                                            id="rememberMe" value="">
                                        <label class="lrv-form-check-label checkbox-label lrv-font-poppins sub-text"
                                            for="rememberMe">Remember Me</label>
                                    </div>
                                </div>
                                <div class="col-6 text-end">
                                    <a href="#"
                                        class="text-decoration-none lrv-text-primary-200 lrv-font-poppins sub-text">Forgot
                                        Password?</a>
                                </div>
                            </div>
                            <!-- User Options -->

                            <!-- Submit button -->
                            <button type="button" id="adminLoginBtn"
                                class="col-12 lrv-btn lrv-btn-primary d-grid item-rounded lrv-font-poppins sub-text">Sign
                                In</button>
                            <!-- Submit button -->

                        </form>

                        <!-- branding -->
                        <div class="col-lg-6 align-self-end d-none d-lg-block" id="laravania">
                            <label for="laravania" class="lrv-font-poppins sub-text">&copy; 2024 Algowrite Solutions</label>

                        </div>
                        <div class="col-lg-6 align-self-end text-end d-none d-lg-block" id="algowrite">
                            <label for="algowrite" class="branding-1 lrv-font-poppins">Designed & Developed by</label><br>
                            <a for="algowrite" href="https://algowrite.com/" class="branding-2 lrv-font-poppins lrv-text-primary-200">Algowrite
                                Software</a>
                        </div>
                    </div>
                </div>
                <!--alert -->
                <div class="toast-container position-fixed top-0 start-0 p-1" style="width: fit-content;" id="alertdiv">

                </div>
                <!--alert -->
            </div>
        </div>
    </section>
    <!-- Admin Sign In -->
@endsection
