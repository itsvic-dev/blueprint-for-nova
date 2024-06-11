@extends('layouts.admin')

@section('title')
  Extensions
@endsection

@section('content-header')
  <h1>Extensions<small>Manage and configure all of your installed extensions.</small></h1>
  <ol class="breadcrumb">
    <li><a href="{{ route('admin.index') }}">Admin</a></li>
    <li class="active">Extensions</li>
  </ol>
@endsection

@section('content')
  @if(($PlaceholderService->installed() != "NOTINSTALLED") && ($PlaceholderService->version() != "::"."v"))

    <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 text-center">
      <a href="{{ route('admin.extensions.blueprint.index') }}">
        <button class="btn extension-btn" style="width:100%;margin-bottom:17px;">
          <img src="/assets/extensions/blueprint/logo.jpg" alt="logo" class="extension-btn-image">
          <p class="extension-btn-text">Blueprint for Nova</p>
          <p class="extension-btn-version">{{ $PlaceholderService->version() }}</p>
        </button>
      </a>
    </div>

    <!-- [entryplaceholder] -->

  @else 
    
    <p><i class='bx bxs-error-alt'></i> You need to finish installing Blueprint to start using extensions.</p>

  @endif
@endsection
