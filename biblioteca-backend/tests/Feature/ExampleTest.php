<?php

namespace Tests\Feature;
use Tests\TestCase;
use App\Services\Calculator;

class ExampleTest extends TestCase
{
    public function test_calculator_soma(){
        $calc = new Calculator();
        $this->assertEquals(5, $calc->soma(2,3));
    }
}
