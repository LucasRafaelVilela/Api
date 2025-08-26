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
    public function test_calculator_multiplica(){
        $calc = new Calculator();
        $this->assertEquals(6, $calc->multiplica(2,3));
    }
    public function test_calculator_elevar(){
        $calc = new Calculator();
        $this->assertEquals(8, $calc->elevar(2,3));
    }
    public function test_calculator_subtrair(){
        $calc = new Calculator();
        $this->assertEquals(-1, $calc->subtrair(2,3));
    }

    public function test_soma_simples(){
        $calc = new Calculator();
        $this->assertEquals("SOMA = 40", $calc->somaSimples(30,10));
        $this->assertEquals("SOMA = -20", $calc->somaSimples(-30,10));
        $this->assertEquals("SOMA = 0", $calc->somaSimples(0, 0));
    }
}
