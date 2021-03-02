<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class PokemonController extends Controller
{
    public function login(){
        return view('login'); 
    }

    public function index(){
        $pokemon=DB::select('select * from pokemon');
        return view('pokedex',['pokemons'=>$pokemon]); 
    }

    public function read(Request $request){
        if($request->input('q')!=''){
            if ($request->input('q')=='favorito') {
                $pokemon=DB::select('select * from pokemon where favorito = 1');
            }else{
                $pokemon=DB::select('select * from pokemon where nombre like ?', ["%".$request->input('q')."%"]);
            }
        }else{
            $pokemon=DB::select('select * from pokemon');
        }
        foreach($pokemon as $i){
            if($i->imagen != null){
                $i->imagen=base64_encode($i->imagen);
            }
        }
        return response()->json($pokemon, 200);
    }

    public function updateFav(Request $request){
        try {
            DB::update('update pokemon set favorito = ? where numero_pokedex=?', [$request->input('favorito'), $request->input('numero_pokedex')]);
            return response()->json(array('resultado'=> 'OK'), 200);
        } catch (\Throwable $th) {
            return response()->json(array('resultado'=> 'NOK: '.$th->getMessage().' | '), 200);
        }

    }
    public function updateImage(Request $request){
        try {
            // getRealPath - Devuelve la ruta del fichero
            $img=$request->file('img')->getRealPath();
            // file_get_contents — Transmite un fichero completo a una cadena
            $img_string = file_get_contents($img);

            DB::update('update pokemon set imagen = ? where numero_pokedex=?', [$img_string, $request->input('numero_pokedex')]);
            return response()->json(array('resultado'=> 'OK'), 200);
        } catch (\Throwable $th) {
            return response()->json(array('resultado'=> 'NOK: '.$th->getMessage().' | '), 200);
        }
    }
}
