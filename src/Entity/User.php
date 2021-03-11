<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=UserRepository::class)
 */
class User
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $login;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $password;

    /**
     * @ORM\OneToMany(targetEntity=Benchmark::class, mappedBy="user", orphanRemoval=true)
     */
    private $benchmarks;

    public function __construct()
    {
        $this->benchmarks = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getLogin(): ?string
    {
        return $this->login;
    }

    public function setLogin(string $login): self
    {
        $this->login = $login;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @return Collection|Benchmark[]
     */
    public function getBenchmarks(): Collection
    {
        return $this->benchmarks;
    }

    public function addBenchmark(Benchmark $benchmark): self
    {
        if (!$this->benchmarks->contains($benchmark)) {
            $this->benchmarks[] = $benchmark;
            $benchmark->setUser($this);
        }

        return $this;
    }

    public function removeBenchmark(Benchmark $benchmark): self
    {
        if ($this->benchmarks->removeElement($benchmark)) {
            // set the owning side to null (unless already changed)
            if ($benchmark->getUser() === $this) {
                $benchmark->setUser(null);
            }
        }

        return $this;
    }
}
