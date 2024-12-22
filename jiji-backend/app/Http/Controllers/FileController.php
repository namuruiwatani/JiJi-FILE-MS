<?php

namespace App\Http\Controllers;

use App\Models\File;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    public function index()
    {
        return view('welcome');
    }

    public function list()
    {
        $files = File::all();

        return response()->json(['data' => $files]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'file' => 'required|file|max:8192',
            'name' => 'nullable|string|max:255',
        ]);

        $file = $request->file('file');
        $path = $file->store('uploads', 'public');

        $newFile = File::create([
            'name' => $validated['name'] ?? $file->getClientOriginalName(),
            'path' => $path,
            'size' => $file->getSize(),
            'extension' => $file->getClientOriginalExtension(),
        ]);

        return response()->json($newFile, 201);
    }

    public function edit($id)
    {
        $file = File::findOrFail($id);

        return response()->json($file);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'file' => 'nullable|file|max:8192',
            'name' => 'nullable|string|max:255',
        ]);

        $file = File::findOrFail($id);

        if ($request->hasFile('file')) {
            Storage::disk('public')->delete($file->path);

            $newFile = $request->file('file');
            $path = $newFile->store('uploads', 'public');
            $file->path = $path;
            $file->size = $newFile->getSize();
            $file->extension = $newFile->getClientOriginalExtension();
        }

        if ($request->input('name')) {
            $file->name = $request->input('name');
        }

        $file->save();

        return response()->json($file);
    }

    public function destroy($id)
    {
        $file = File::findOrFail($id);

        Storage::disk('public')->delete($file->path);

        $file->delete();

        return response()->json(['message' => 'File deleted successfully.']);
    }

    public function download($id)
    {
        $file = File::findOrFail($id);

        $filePath = $file->path;

        if (!Storage::disk('public')->exists($filePath)) {
            return response()->json(['message' => 'File not found.'], 404);
        }

        return Storage::disk('public')->download($filePath, $file->name, [
            'Content-Disposition' => 'attachment; filename="' . $file->name . '"',
            'Content-Type' => mime_content_type(storage_path('app/public/' . $filePath)),
        ]);
    }
}
