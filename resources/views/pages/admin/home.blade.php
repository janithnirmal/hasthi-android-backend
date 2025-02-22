@extends('layout.admin-layout')
@section('title', 'Admin Home Page')

@isCustomPage(true)

@section('custom_css_js')
    @vite('resources/css/admin_panel.css')
    @vite('resources/js/pages/admin/admin_panel.js')
@endsection

{{-- admin main container ID - adminPanelMainContainer --}}
@section('content')
    <section class="vh-100 lrv-bg-secondary-700">
        <div class="container-fluid">
            <div class="row ">
                <!-- header -->
                <nav class="navbar lrv-bg-secondary-800 lrv-shadow-s header fixed-toprounded-0">
                    <div class="container-fluid">
                        <a class="navbar-brand d-block d-xl-none" data-bs-toggle="offcanvas" data-bs-target="#staticBackdrop"
                            aria-controls="staticBackdrop"><i class="fa-solid fa-align-justify lrv-fs-6"></i></a>
                        <div class="d-flex gap-3 p-2" style="height: 60px;">
                            <div class="logo-div d-flex flex-row align-items-center">
                                <h1 class="lrv-text-light lrv-fw-medium">Laravania</h1>
                            </div>
                        </div>
                        <div class="d-flex align-items-center">
                            <div class="notification-container">
                                <button id="notification-button"
                                    class="lrv-btn lrv-btn-unstyled lrv-text-dark notification-button"><i
                                        class="fa-solid fa-bell notification-button"></i></button>
                                <div id="notification-dropdown" class="notification-dropdown">
                                    <ul id="notification-list">
                                        <li class="d-inline-flex w-100 align-items-center">
                                            <div class="col-2 text-center">
                                                <img src="{{ asset('/storage/images/Admin/user_img.png') }}" alt=""
                                                    class="notification-img">
                                            </div>
                                            <div class="col-9">
                                                <span class="lrv-fs-7">sdfslkdnfas sdlkf jalkdsfj lsdj fla</span><br>
                                                <div class="d-inline-block">
                                                    <span class="lrv-fs-8 lrv-bg-secondary-200 lrv-rounded-1 px-2">New
                                                        Order</span>
                                                    <span class="lrv-fs-8">2024/05/06 20:45:12</span>
                                                </div>
                                            </div>
                                            <div class="col-1 text-center">
                                                <button class="lrv-btn lrv-btn-unstyled lrv-text-red-600">
                                                    <i class="fa-solid fa-trash"></i>
                                                </button>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <img src="{{ asset('/storage/images/Admin/user_img.png') }}" alt="admin user image"
                                class="admin-image lrv-rounded-circle  p-1">
                            <div class="d-flex flex-column py-1" id="adminProfile">
                                <h3 class="lrv-fs-7 lrv-fw-bold lrv-font-poppins">
                                    <span data-field="admin_details.first_name"></span>
                                    <span data-field="admin_details.last_name"></span>
                                </h3>
                                <label class="lrv-fs-8 lrv-fw-semibold lrv-font-poppins" data-field="admin_details.role"
                                    data-filter="nameFormatter:pascal_underscore">...</label>
                            </div>
                        </div>
                    </div>
                </nav>

                <!-- sidebar -->
                <div class="sidebar col-2 d-none d-xl-block m-0 p-0 pt-5 lrv-bg-secondary-500 lrv-shadow-l"
                    id="desktopSidePanelContainer">
                    <div class="nav flex-column nav-pills p-0" role="tablist" aria-orientation="vertical"
                        id="adminPanelSideBar">
                        <div class="scroll-sidebar p-0 mt-5 d-flex flex-column gap-2">
                            <button data-admin-panel-switch="menu" data-adminPanel="menu"
                                class="nav-link lrv-text-light lrv-fs-7 lrv-fw-normal text-start"><i
                                    class="fa-solid fa-pen-ruler"></i> <span class="ps-3">Menu</span></button>
                            <button data-admin-panel-switch="events" data-adminPanel="events"
                                class="nav-link lrv-text-light lrv-fs-7 lrv-fw-normal text-start"><i
                                    class="fa-solid fa-user"></i> <span class="ps-3">Events</span></button>
                        </div>

                        <hr>

                        <div class="bottom-sidebar fixed-bottom d-grid text-start p-0 pb-1 gap-2">
                            <button class="lrv-btn lrv-text-light lrv-fs-7 lrv-fw-normal text-start" role="button"
                                data-bs-toggle="modal" data-bs-target="#logoutModal"><i
                                    class="fa-solid fa-right-from-bracket"></i><span class="ps-3">Log
                                    out</span></button>
                            <button data-admin-panel-switch="test" data-adminPanel="test"
                                class="nav-link lrv-text-light lrv-fs-7 lrv-fw-normal text-start"><i
                                    class='fa-solid fa-gear'></i>
                                <span class="ps-3">Test</span></button>
                        </div>
                    </div>
                </div>

                <div class="col-12 col-xl-10 offset-xl-2 p-0 mt-5 pt-5 lrv-bg-secondary-200">
                    <div class="tab-content p-3" id="adminPanelMainContainer">
                        <!-- content -->
                    </div>
                </div>

                <!-- offcanvas -->
                <div class="offcanvas offcanvas-start" data-bs-backdrop="offcanvas" tabindex="-1" id="staticBackdrop"
                    aria-labelledby="staticBackdropLabel">
                    <div class="offcanvas-header justify-content-end pt-4">
                        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"
                            id="sideBarCloseBtn"></button>
                    </div>
                    <div class="offcanvas-body sidebar-sm p-0" id="mobileSidePanelContainer">
                        <!-- side panel will load here -->

                    </div>
                </div>

                <!-- logout modal -->
                <div class="modal fade" id="logoutModal" tabindex="-1" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content lrv-bg-primary-100">
                            <div class="modal-header border border-0 d-flex justify-content-end">
                                <button type="button" class="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                            </div>
                            <div class="modal-body d-flex flex-column justify-content-center align-items-center px-5">
                                <div class="d-flex flex-row w-100 justify-content-center align-items-center">
                                    <p class=" lrv-fs-6">Do you want to <span class=" lrv-fw-bold">Log Out</span> ?</p>
                                </div>
                                <div class="d-flex flex-row w-100 p-3 justify-content-between">
                                    <button class="lrv-btn-primary lrv-bg-red-600 col-5 lrv-rounded-pill"
                                        onclick="adminLogOut();">Log Out</button>
                                    <button class="lrv-btn-primary col-5 lrv-rounded-pill"
                                        data-bs-dismiss="modal">Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>
@endsection
