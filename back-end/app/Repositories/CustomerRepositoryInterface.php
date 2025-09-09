<?php
namespace App\Repositories;

interface CustomerRepositoryInterface
{
    public function all();
    public function find($id);
    public function create(array $data);
    public function update($id, array $data);
    public function delete($id);

    public function getAll(array $filter);
    public function isCodeExists($customerCode);
    public function isActiveAndExists($id): bool;
      public function getDropdownList();
}
