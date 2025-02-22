<?php

namespace App\Action;

class ResponseProtocol
{
    public static $statusTypes = [
        "failed" => 0,
        "success" => 1,
    ];

    public static function success($results = [], $message = null, $code = 200)
    {
        return response()->json([
            'status' => "success",
            'message' => $message ?? null,
            'results' => $results,
        ], $code);
    }


    public static function failed($errors = [], $message = null, $code = 400)
    {
        return response()->json([
            'status' => "failed",
            'message' => $message ?? null,
            'errors' => $errors,
        ], $code);
    }

    public static function response($type, $results = [], $message = null, $code = 200)
    {
        if ($type == self::$statusTypes["success"]) {
            return self::success($results, $message, $code >= 200 && $code < 300 ? $code : 200);
        } else if ($type == self::$statusTypes["failed"]) {
            return self::failed($results, $message, $code >= 200 && $code < 300 ? 400 : $code);
        }
    }
}
