<?php

$config = [];

$config['db_dsn'] = 'sqlite:' . __DIR__ . '/../data.db';
$config['db_user'] = '';
$config['db_pass'] = '';

$config['routes'] = [

    'post_index' => [
        'path' => '/',
        'controller' => 'PostController::indexAction',
        'method' => 'GET'
    ],
    'post_show' => [
        'path' => '/post/show',
        'controller' => 'PostController::showAction',
        'method' => 'GET'
    ],
    'post_create' => [
        'path' => '/post/create',
        'controller' => 'PostController::createAction',
        'method' => 'GET|POST'
    ],
    'post_edit' => [
        'path' => '/post/edit',
        'controller' => 'PostController::editAction',
        'method' => 'GET|POST'
    ],
    'post_delete' => [
        'path' => '/post/delete',
        'controller' => 'PostController::deleteAction',
        'method' => 'GET'
    ],

    'book_index' => [
        'path' => '/book',
        'controller' => 'BookController::indexAction',
        'method' => 'GET'
    ],
    'book_show' => [
        'path' => '/book/show',
        'controller' => 'BookController::showAction',
        'method' => 'GET'
    ],
    'book_create' => [
        'path' => '/book/create',
        'controller' => 'BookController::createAction',
        'method' => 'GET|POST'
    ],
    'book_edit' => [
        'path' => '/book/edit',
        'controller' => 'BookController::editAction',
        'method' => 'GET|POST'
    ],
    'book_delete' => [
        'path' => '/book/delete',
        'controller' => 'BookController::deleteAction',
        'method' => 'GET'
    ],
];

return $config;