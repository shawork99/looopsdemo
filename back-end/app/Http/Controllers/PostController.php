<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Crodtable;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $posts = crodtable::select("id","title", "details","userID")->get();
        return response()->json($posts);
        
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $post = crodtable::create($request->only(["title","userID","details"]));

        return response()->json([
                "id" => $post->id,
                "title" => $post->title,
                "userID" => $post->userID,
                "details" => $post->details,

        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $post = crodtable::find($id);
        return response()->json([
                "id" => $post->id,
                "title" => $post->title,
                "userID" => $post->userID,
                "details" => $post->details,

        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
       $post = crodtable::find($id);

       $post->title = $request->title;
       $post->details = $request->details;
       $post->save();

        return response()->json([
                "id" => $post->id,
                "title" => $post->title,
                "userID" => $post->userID,
                "details" => $post->details,

        ]);

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(string $id)
        {
            crodtable::destroy($id);
            return response()->json(['message' => 'Deleted successfully']);
        }
}
