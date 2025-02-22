<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ResponseProtocol
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // pre-processing
        $response = $next($request);

        // post-processing


        if ($response->getStatusCode() >= 300 || $response->getStatusCode() < 200) {
            
            if ($response->getStatusCode() == 422) {
                $response->setStatusCode(299, "Request Error : processing undeveloped");
            }

            $content = $response->getContent();
            if (is_string($content) && json_decode($content) !== null && json_last_error() === JSON_ERROR_NONE) {
                $decodedContent = json_decode($content, true);
                return \App\Action\ResponseProtocol::failed($decodedContent['errors'] ?? [], $decodedContent['message'] ?? null, $response->getStatusCode());
            }
            return \App\Action\ResponseProtocol::failed([], 'An error occurred', $response->getStatusCode());
        }
        return $response;
    }
}