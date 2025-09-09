<?php
namespace App\Http\Controllers;

use App\Repositories\CompanyRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Exception;

class CompanyAPIController extends Controller
{
    public function __construct(protected CompanyRepository $companyRepository) {}

    public function index(Request $request)
    {
        try {
            $user = $request->user();
            $company = $this->companyRepository->findForUser($user->id);

            return response()->json([
                'success' => true,
                'data'    => $company,
                'message' => 'Company loaded successfully'
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function update(Request $request, $id)
    {
        $input = $request->only([
            'name',
            // 'company_code',
            'country',
            'currency',
            'time_zone',
            'contact_person',
            'contact_email',
            'contact_no',
            'company_start_date',
            'memo',
            'is_active',
            'company_logo'
        ]);

        try {
           $validator = Validator::make($input, [
                'name'              => 'required|string|max:255',
                // 'company_code'      => 'required|string|max:50',
                'country'           => 'required|string|max:20',      
                'currency'          => 'required|integer|exists:currencies,id',  
                'time_zone'         => 'nullable|string|max:50',      
                'contact_person'    => 'nullable|string|max:255',     
                'contact_email'     => 'nullable|email|max:255',       
                'contact_no'        => 'nullable|numeric',             
                'company_start_date'=> 'nullable|date',            
                'memo'              => 'nullable|string',            
                'is_active'         => 'required|boolean'        
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => $validator->getMessageBag(),
                ], 400);
            }

            $company = $this->companyRepository->find($id);

            if (! $company) {
                return response()->json([
                    'success' => false,
                    'message' => 'Company not found',
                ], 404);
            }

            if (isset($input['company_logo'])) {
                if (!preg_match('/^data:image\/(jpeg|png);base64,/', $input['company_logo'])) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Invalid image format. Only JPEG and PNG allowed.',
                    ], 400);
                }
                $maxSize = 5 * 1024 * 1024;
                if (strlen($input['company_logo']) > $maxSize) {
                    return response()->json(['error' => 'File size exceeds 5MB limit.'], 400);
                }
            }
            
            // $company->update($input);
            $company = $this->companyRepository->update($id, $input);


            return response()->json([
                'success' => true,
                'message' => 'Company updated successfully'
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function show($id)
    {
        try {
            $company = $this->companyRepository->find($id);

            if (! $company) {
                return response()->json([
                    'success' => false,
                    'message' => 'Company not found',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $company,
                'message' => 'Company retrieved successfully'
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }
}
