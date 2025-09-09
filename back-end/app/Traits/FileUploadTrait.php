<?php

namespace App\Traits;

use App\Models\Attachment;
use App\Models\Company;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Auth;
use Str;

trait FileUploadTrait
{
    public function uploadBase64FileUsingSystemUser($base64String, $generateTempLink = false)
    {
        $companyId = Auth::user()->current_company_id;
        $company = Company::select('name')->find($companyId);
        $copmanyName = Str::of($company->name)->replace(' ', '_');
        $fullPath = $copmanyName . "/user_id_" . Auth::user()->id;
        return $this->fileUpload($base64String, $fullPath, $generateTempLink);
    }


    public function fileUpload($base64String, $fullPath, $generateTempLink)
    {
        try {
            $fileMeta =  $this->getFileMetaData($base64String);
            if (Str::contains($base64String, ',')) {
                [, $base64String] = explode(',', $base64String);
            }
            $decodedFile = base64_decode($base64String);
            if ($decodedFile === false) {
                abort(500, 'File base64 format is invalid');
            }
            $fileSizeInMb =  round(strlen($base64String) / 1048576, 2);
            $uniqueFilename = uniqid() . '.' . $fileMeta['extension'];
            $fullPath = $fullPath . '/' . $uniqueFilename;
            Storage::disk('s3')->put($fullPath, $decodedFile);
            //For Audi Purpose
            Attachment::create([
                'file_name' => $uniqueFilename,
                'file_path'  => $fullPath,
                'mime_type' => $fileMeta['mime'],
                'file_extension'  => $fileMeta['extension'],
                'file_size_in_mb' => $fileSizeInMb
            ]);
            if ($generateTempLink) {
                return [
                    'path' => $fullPath,
                    'url' => $this->generateS3TemporaryUrl($fullPath)
                ];
            } else {
                return [
                    'path' => $fullPath
                ];
            }
        } catch (Exception $e) {
            abort(500, $e->getMessage());
        }
    }


    public function getFileMetaData(string $base64String)
    {
        if (Str::contains($base64String, ';base64')) {
            preg_match("/^data:(.*?);base64/", $base64String, $matches);
            if (isset($matches[1])) {
                $mimeType = $matches[1]; // e.g., image/png
                $extension = null;
                if (isset($mimeType)) {
                    $mimeToExtensionMap = [
                        // Images
                        'image/jpeg' => 'jpg',
                        'image/pjpeg' => 'jpg',
                        'image/png' => 'png',
                        'image/gif' => 'gif',
                        'image/webp' => 'webp',
                        'image/bmp' => 'bmp',
                        'image/tiff' => 'tiff',
                        'image/svg+xml' => 'svg',
                        'image/x-icon' => 'ico',

                        // Documents
                        'application/pdf' => 'pdf',
                        'application/msword' => 'doc',
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'docx',
                        'application/vnd.ms-excel' => 'xls',
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' => 'xlsx',
                        'application/vnd.ms-powerpoint' => 'ppt',
                        'application/vnd.openxmlformats-officedocument.presentationml.presentation' => 'pptx',
                        'text/plain' => 'txt',
                        'text/csv' => 'csv',
                        'application/rtf' => 'rtf',
                        'application/json' => 'json',
                        'application/xml' => 'xml',
                        'application/zip' => 'zip',

                        // Audio
                        'audio/mpeg' => 'mp3',
                        'audio/wav' => 'wav',
                        'audio/ogg' => 'ogg',
                        'audio/webm' => 'weba',
                        'audio/mp4' => 'm4a',

                        // Video
                        'video/mp4' => 'mp4',
                        'video/x-msvideo' => 'avi',
                        'video/mpeg' => 'mpeg',
                        'video/webm' => 'webm',
                        'video/ogg' => 'ogv',
                        'video/3gpp' => '3gp',
                        'video/quicktime' => 'mov',

                        // Archives
                        'application/x-tar' => 'tar',
                        'application/x-rar-compressed' => 'rar',
                        'application/x-7z-compressed' => '7z',
                        'application/x-bzip' => 'bz',
                        'application/x-bzip2' => 'bz2',
                        'application/gzip' => 'gz',
                        'application/x-zip-compressed' => 'zip',

                        // Code
                        'text/html' => 'html',
                        'text/css' => 'css',
                        'application/javascript' => 'js',
                        'application/x-httpd-php' => 'php',
                        'application/java-archive' => 'jar',
                        'application/x-python-code' => 'py',
                    ];

                    $extension  = $mimeToExtensionMap[$mimeType] ?? explode('/', $mimeType)[1] ?? null;
                }
                return [
                    'mime' => $mimeType,
                    'extension' => $extension,
                ];
            }
        }
        return null;
    }

    public function generateS3TemporaryUrl(string $path, int $minutes = 5): ?string
    {
        if (!Storage::disk('s3')->exists($path)) {
            return null;
        }

        return Storage::disk('s3')->temporaryUrl(
            $path,
            Carbon::now()->addMinutes($minutes)
        );
    }

    public function deleteFile($filePath)
    {
        if (Storage::disk('s3')->exists($filePath)) {
            Storage::disk('s3')->delete($filePath);
        } else {
            abort(404, "File not found.");
        }
    }
}
