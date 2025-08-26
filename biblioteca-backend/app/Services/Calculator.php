<?php

namespace App\Services;

class Calculator
{
    public function soma($a, $b) {
        return $a + $b;
    }

    public function multiplica($a, $b) {
        return $a * $b;
    }

    public function elevar($a, $b) {
        return $a ** $b;
    }

    public function subtrair($a, $b) {
        return $a - $b;
    }

}