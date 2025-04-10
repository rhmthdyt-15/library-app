<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;

trait HttpThrowExceptionTrait {

	public function throwInternalServerError(string $errorMessage) {
		return new HttpException(Response::HTTP_INTERNAL_SERVER_ERROR, $errorMessage);
	}

	public function throwBadRequest(string $errorMessage) {
		return new HttpException(Response::HTTP_BAD_REQUEST, $errorMessage);
	}

	public function throwAuthRequest(string $errorMessage) {
		return new AuthenticationException($errorMessage);
	}

}