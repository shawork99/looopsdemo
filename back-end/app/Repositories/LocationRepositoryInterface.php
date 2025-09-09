<?php

namespace App\Repositories;

interface LocationRepositoryInterface
{
    public function create(array $data);
    public function getAll(array $filter);
    public function find($id);
    public function update($id, array $data);
    public function delete($id);
    public function isCodeExists(string $locationCode): bool;
    public function isActiveAndExists($id): bool;
    public function getDropdownList();
}
