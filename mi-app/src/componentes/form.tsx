import React, { useState } from "react";

type CardInput = {
  name: string;
  description: string;
  attack: number;
  defense: number;
  type: string;
  image: string;
};

const form: React.FC = () => {
  const [card, setCard] = useState<CardInput>({
    name: "",
    description: "",
    attack: 0,
    defense: 0,
    type: "",
    image: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (input: CardInput) => {
    const newErrors: Record<string, string> = {};

    if (!input.name || input.name.length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres";
    }
    if (!input.description) {
      newErrors.description = "La descripción es obligatoria";
    }
    if (Number.isNaN(Number(input.attack)) || Number(input.attack) < 0) {
      newErrors.attack = "El ataque debe ser un número positivo";
    }
    if (Number.isNaN(Number(input.defense)) || Number(input.defense) < 0) {
      newErrors.defense = "La defensa debe ser un número positivo";
    }
    if (!input.type) {
      newErrors.type = "El tipo es obligatorio";
    }
    if (!input.image) {
      newErrors.image = "La URL de la imagen es obligatoria";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof CardInput, value: string) => {
    setCard(prev => ({ ...prev, [field]: field === "attack" || field === "defense" ? Number(value) : value }));
  };

  const handleValidate = () => {
    const ok = validate(card);
    if (ok) {

      alert("La tarjeta es válida");
    }
  };

  return (
    <div className="max-w-md mx-auto mb-6">
      <input
        type="text"
        placeholder="Nombre"
        className="border border-indigo-500 outline-0 focus:border-indigo-700 rounded-md p-2 w-full mb-2"
        value={card.name}
        onChange={e => handleChange("name", e.target.value)}
      />
      {errors.name && <p className="text-red-500">{errors.name}</p>}

      <textarea
        placeholder="Descripción"
        className="border border-indigo-500 outline-0 focus:border-indigo-700 rounded-md p-2 w-full mb-2"
        value={card.description}
        onChange={e => handleChange("description", e.target.value)}
      />
      {errors.description && <p className="text-red-500">{errors.description}</p>}

      <input
        type="number"
        placeholder="Ataque"
        className="border border-indigo-500 outline-0 focus:border-indigo-700 rounded-md p-2 w-full mb-2"
        value={card.attack}
        onChange={e => handleChange("attack", e.target.value)}
      />
      {errors.attack && <p className="text-red-500">{errors.attack}</p>}

      <input
        type="number"
        placeholder="Defensa"
        className="border border-indigo-500 outline-0 focus:border-indigo-700 rounded-md p-2 w-full mb-2"
        value={card.defense}
        onChange={e => handleChange("defense", e.target.value)}
      />
      {errors.defense && <p className="text-red-500">{errors.defense}</p>}

      <input
        type="text"
        placeholder="Tipo"
        className="border border-indigo-500 outline-0 focus:border-indigo-700 rounded-md p-2 w-full mb-2"
        value={card.type}
        onChange={e => handleChange("type", e.target.value)}
      />
      {errors.type && <p className="text-red-500">{errors.type}</p>}

      <input
        type="text"
        placeholder="URL imagen"
        className="border border-indigo-500 outline-0 focus:border-indigo-700 rounded-md p-2 w-full mb-2"
        value={card.image}
        onChange={e => handleChange("image", e.target.value)}
      />
      {errors.image && <p className="text-red-500">{errors.image}</p>}

      <button
        className="bg-indigo-500 text-white font-bold py-2 px-4 rounded"
        onClick={handleValidate}
        type="button"
      >
        Validar
      </button>
    </div>
  );
};

export default form;