@extends('layout.core-layout')


@section('body')
    {{-- PAGE CONTENT --}}
    @yield('content')
@endsection

@section('other_templates')
    @yield('templates')
@endsection
