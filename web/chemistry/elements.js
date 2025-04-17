const elements = [
    // Row 1 (1-2)
    { symbol: "H", atomic: 1, mass: 1.008, names: { en: "Hydrogen", ru: "Водород", ua: "Водень" }, category: "nonmetal", isMetallic: false, position: { row: 1, col: 1 }, valences: [1, -1], group: "s" },
    { symbol: "He", atomic: 2, mass: 4.0026, names: { en: "Helium", ru: "Гелий", ua: "Гелій" }, category: "noble-gas", isMetallic: false, position: { row: 1, col: 8 }, valences: [0], group: "p" },

    // Row 2 (3-10)
    { symbol: "Li", atomic: 3, mass: 6.94, names: { en: "Lithium", ru: "Литий", ua: "Літій" }, category: "alkali-metal", isMetallic: true, position: { row: 2, col: 1 }, valences: [1], group: "s" },
    { symbol: "Be", atomic: 4, mass: 9.0122, names: { en: "Beryllium", ru: "Бериллий", ua: "Берилій" }, category: "alkaline-earth-metal", isMetallic: true, position: { row: 2, col: 2 }, valences: [2], group: "s" },
    { symbol: "B", atomic: 5, mass: 10.81, names: { en: "Boron", ru: "Бор", ua: "Бор" }, category: "metalloid", isMetallic: false, position: { row: 2, col: 3 }, valences: [3], group: "p" },
    { symbol: "C", atomic: 6, mass: 12.011, names: { en: "Carbon", ru: "Углерод", ua: "Вуглець" }, category: "nonmetal", isMetallic: false, position: { row: 2, col: 4 }, valences: [2, 4, -4], group: "p" },
    { symbol: "N", atomic: 7, mass: 14.007, names: { en: "Nitrogen", ru: "Азот", ua: "Азот" }, category: "nonmetal", isMetallic: false, position: { row: 2, col: 5 }, valences: [1, 2, 3, 4, -3], group: "p" },
    { symbol: "O", atomic: 8, mass: 15.999, names: { en: "Oxygen", ru: "Кислород", ua: "Кисень" }, category: "nonmetal", isMetallic: false, position: { row: 2, col: 6 }, valences: [-2], group: "p" },
    { symbol: "F", atomic: 9, mass: 18.998, names: { en: "Fluorine", ru: "Фтор", ua: "Фтор" }, category: "halogen", isMetallic: false, position: { row: 2, col: 7 }, valences: [-1], group: "p" },
    { symbol: "Ne", atomic: 10, mass: 20.180, names: { en: "Neon", ru: "Неон", ua: "Неон" }, category: "noble-gas", isMetallic: false, position: { row: 2, col: 8 }, valences: [0], group: "p" },

    // Row 3 (11-18)
    { symbol: "Na", atomic: 11, mass: 22.990, names: { en: "Sodium", ru: "Натрий", ua: "Натрій" }, category: "alkali-metal", isMetallic: true, position: { row: 3, col: 1 }, valences: [1], group: "s" },
    { symbol: "Mg", atomic: 12, mass: 24.305, names: { en: "Magnesium", ru: "Магний", ua: "Магній" }, category: "alkaline-earth-metal", isMetallic: true, position: { row: 3, col: 2 }, group: "s" },
    { symbol: "Al", atomic: 13, mass: 26.982, names: { en: "Aluminum", ru: "Алюминий", ua: "Алюміній" }, category: "post-transition-metal", isMetallic: true, position: { row: 3, col: 3 }, group: "p" },
    { symbol: "Si", atomic: 14, mass: 28.085, names: { en: "Silicon", ru: "Кремний", ua: "Кремній" }, category: "metalloid", isMetallic: false, position: { row: 3, col: 4 }, group: "p" },
    { symbol: "P", atomic: 15, mass: 30.974, names: { en: "Phosphorus", ru: "Фосфор", ua: "Фосфор" }, category: "nonmetal", isMetallic: false, position: { row: 3, col: 5 }, group: "p" },
    { symbol: "S", atomic: 16, mass: 32.06, names: { en: "Sulfur", ru: "Сера", ua: "Сірка" }, category: "nonmetal", isMetallic: false, position: { row: 3, col: 6 }, group: "p" },
    { symbol: "Cl", atomic: 17, mass: 35.45, names: { en: "Chlorine", ru: "Хлор", ua: "Хлор" }, category: "halogen", isMetallic: false, position: { row: 3, col: 7 }, group: "p" },
    { symbol: "Ar", atomic: 18, mass: 39.948, names: { en: "Argon", ru: "Аргон", ua: "Аргон" }, category: "noble-gas", isMetallic: false, position: { row: 3, col: 8 }, group: "p" },

    // Row 4 (19-36, split into two rows)
    { symbol: "K", atomic: 19, mass: 39.098, names: { en: "Potassium", ru: "Калий", ua: "Калій" }, category: "alkali-metal", isMetallic: true, position: { row: 4, col: 1 }, group: "s" },
    { symbol: "Ca", atomic: 20, mass: 40.078, names: { en: "Calcium", ru: "Кальций", ua: "Кальцій" }, category: "alkaline-earth-metal", isMetallic: true, position: { row: 4, col: 2 }, group: "s" },
    { symbol: "Sc", atomic: 21, mass: 44.956, names: { en: "Scandium", ru: "Скандий", ua: "Скандій" }, category: "transition-metal", isMetallic: true, position: { row: 4, col: 3 }, valences: [3], group: "d" },
    { symbol: "Ti", atomic: 22, mass: 47.867, names: { en: "Titanium", ru: "Титан", ua: "Титан" }, category: "transition-metal", isMetallic: true, position: { row: 4, col: 4 }, valences: [2, 3, 4], group: "d" },
    { symbol: "V", atomic: 23, mass: 50.942, names: { en: "Vanadium", ru: "Ванадий", ua: "Ванадій" }, category: "transition-metal", isMetallic: true, position: { row: 4, col: 5 }, valences: [2, 3, 4, 5], group: "d" },
    { symbol: "Cr", atomic: 24, mass: 51.996, names: { en: "Chromium", ru: "Хром", ua: "Хром" }, category: "transition-metal", isMetallic: true, position: { row: 4, col: 6 }, valences: [2, 3, 6], group: "d" },
    { symbol: "Mn", atomic: 25, mass: 54.938, names: { en: "Manganese", ru: "Марганец", ua: "Марганець" }, category: "transition-metal", isMetallic: true, position: { row: 4, col: 7 }, valences: [2, 3, 4, 6, 7], group: "d" },
    { symbol: "Fe", atomic: 26, mass: 55.845, names: { en: "Iron", ru: "Железо", ua: "Залізо" }, category: "transition-metal", isMetallic: true, position: { row: 4, col: 8 }, valences: [2, 3], group: "d" },
    { symbol: "Co", atomic: 27, mass: 58.933, names: { en: "Cobalt", ru: "Кобальт", ua: "Кобальт" }, category: "transition-metal", isMetallic: true, position: { row: 4, col: 9 }, valences: [2, 3], group: "d" },
    { symbol: "Ni", atomic: 28, mass: 58.693, names: { en: "Nickel", ru: "Никель", ua: "Нікель" }, category: "transition-metal", isMetallic: true, position: { row: 4, col: 10 }, valences: [2, 3], group: "d" },

    { symbol: "Cu", atomic: 29, mass: 63.546, names: { en: "Copper", ru: "Медь", ua: "Мідь" }, category: "transition-metal", isMetallic: true, position: { row: 5, col: 1 }, valences: [1, 2], group: "d" },
    { symbol: "Zn", atomic: 30, mass: 65.38, names: { en: "Zinc", ru: "Цинк", ua: "Цинк" }, category: "transition-metal", isMetallic: true, position: { row: 5, col: 2 }, valences: [2], group: "d" },
    { symbol: "Ga", atomic: 31, mass: 69.723, names: { en: "Gallium", ru: "Галлий", ua: "Галій" }, category: "post-transition-metal", isMetallic: true, position: { row: 5, col: 3 }, valences: [3], group: "p" },
    { symbol: "Ge", atomic: 32, mass: 72.630, names: { en: "Germanium", ru: "Германий", ua: "Германій" }, category: "metalloid", isMetallic: false, position: { row: 5, col: 4 }, valences: [2, 4], group: "p" },
    { symbol: "As", atomic: 33, mass: 74.922, names: { en: "Arsenic", ru: "Мышьяк", ua: "Арсен" }, category: "metalloid", isMetallic: false, position: { row: 5, col: 5 }, valences: [3, 5, -3], group: "p" },
    { symbol: "Se", atomic: 34, mass: 78.971, names: { en: "Selenium", ru: "Селен", ua: "Селен" }, category: "nonmetal", isMetallic: false, position: { row: 5, col: 6 }, valences: [-2, 4, 6], group: "p" },
    { symbol: "Br", atomic: 35, mass: 79.904, names: { en: "Bromine", ru: "Бром", ua: "Бром" }, category: "halogen", isMetallic: false, position: { row: 5, col: 7 }, valences: [-1, 1, 3, 5], group: "p" },
    { symbol: "Kr", atomic: 36, mass: 83.798, names: { en: "Krypton", ru: "Криптон", ua: "Криптон" }, category: "noble-gas", isMetallic: false, position: { row: 5, col: 8 }, valences: [0], group: "p" },

    // Row 5 (37-54, split into two rows)
    { symbol: "Rb", atomic: 37, mass: 85.468, names: { en: "Rubidium", ru: "Рубидий", ua: "Рубідій" }, category: "alkali-metal", isMetallic: true, position: { row: 6, col: 1 }, valences: [1], group: "s" },
    { symbol: "Sr", atomic: 38, mass: 87.62, names: { en: "Strontium", ru: "Стронций", ua: "Стронцій" }, category: "alkaline-earth-metal", isMetallic: true, position: { row: 6, col: 2 }, valences: [2], group: "s" },
    { symbol: "Y", atomic: 39, mass: 88.906, names: { en: "Yttrium", ru: "Иттрий", ua: "Ітрій" }, category: "transition-metal", isMetallic: true, position: { row: 6, col: 3 }, valences: [3], group: "d" },
    { symbol: "Zr", atomic: 40, mass: 91.224, names: { en: "Zirconium", ru: "Цирконий", ua: "Цирконій" }, category: "transition-metal", isMetallic: true, position: { row: 6, col: 4 }, valences: [4], group: "d" },
    { symbol: "Nb", atomic: 41, mass: 92.906, names: { en: "Niobium", ru: "Ниобий", ua: "Ніобій" }, category: "transition-metal", isMetallic: true, position: { row: 6, col: 5 }, valences: [5], group: "d" },
    { symbol: "Mo", atomic: 42, mass: 95.95, names: { en: "Molybdenum", ru: "Молибден", ua: "Молібден" }, category: "transition-metal", isMetallic: true, position: { row: 6, col: 6 }, valences: [6], group: "d" },
    { symbol: "Tc", atomic: 43, mass: 98, names: { en: "Technetium", ru: "Технеций", ua: "Технецій" }, category: "transition-metal", isMetallic: true, position: { row: 6, col: 7 }, valences: [7], group: "d" },
    { symbol: "Ru", atomic: 44, mass: 101.07, names: { en: "Ruthenium", ru: "Рутений", ua: "Рутеній" }, category: "transition-metal", isMetallic: true, position: { row: 6, col: 8 }, valences: [3, 4, 6, 8], group: "d" },
    { symbol: "Rh", atomic: 45, mass: 102.91, names: { en: "Rhodium", ru: "Родий", ua: "Родій" }, category: "transition-metal", isMetallic: true, position: { row: 6, col: 9 }, valences: [3], group: "d" },
    { symbol: "Pd", atomic: 46, mass: 106.42, names: { en: "Palladium", ru: "Палладий", ua: "Паладій" }, category: "transition-metal", isMetallic: true, position: { row: 6, col: 10 }, valences: [2, 4], group: "d" },

    { symbol: "Ag", atomic: 47, mass: 107.87, names: { en: "Silver", ru: "Серебро", ua: "Срібло" }, category: "transition-metal", isMetallic: true, position: { row: 7, col: 1 }, valences: [1], group: "d" },
    { symbol: "Cd", atomic: 48, mass: 112.41, names: { en: "Cadmium", ru: "Кадмий", ua: "Кадмій" }, category: "transition-metal", isMetallic: true, position: { row: 7, col: 2 }, valences: [2], group: "d" },
    { symbol: "In", atomic: 49, mass: 114.82, names: { en: "Indium", ru: "Индий", ua: "Індій" }, category: "post-transition-metal", isMetallic: true, position: { row: 7, col: 3 }, valences: [3], group: "p" },
    { symbol: "Sn", atomic: 50, mass: 118.71, names: { en: "Tin", ru: "Олово", ua: "Олово" }, category: "post-transition-metal", isMetallic: true, position: { row: 7, col: 4 }, valences: [2, 4], group: "p" },
    { symbol: "Sb", atomic: 51, mass: 121.76, names: { en: "Antimony", ru: "Сурьма", ua: "Сурма" }, category: "metalloid", isMetallic: false, position: { row: 7, col: 5 }, valences: [3, 5, -3], group: "p" },
    { symbol: "Te", atomic: 52, mass: 127.60, names: { en: "Tellurium", ru: "Теллур", ua: "Телур" }, category: "metalloid", isMetallic: false, position: { row: 7, col: 6 }, valences: [-2, 4, 6], group: "p" },
    { symbol: "I", atomic: 53, mass: 126.90, names: { en: "Iodine", ru: "Йод", ua: "Йод" }, category: "halogen", isMetallic: false, position: { row: 7, col: 7 }, valences: [-1, 1, 3, 5, 7], group: "p" },
    { symbol: "Xe", atomic: 54, mass: 131.29, names: { en: "Xenon", ru: "Ксенон", ua: "Ксенон" }, category: "noble-gas", isMetallic: false, position: { row: 7, col: 8 }, valences: [0, 2, 4, 6, 8], group: "p" },

    // Row 6 (55-86, split into rows)
    { symbol: "Cs", atomic: 55, mass: 132.91, names: { en: "Cesium", ru: "Цезий", ua: "Цезій" }, category: "alkali-metal", isMetallic: true, position: { row: 8, col: 1 }, valences: [1], group: "s" },
    { symbol: "Ba", atomic: 56, mass: 137.33, names: { en: "Barium", ru: "Барий", ua: "Барій" }, category: "alkaline-earth-metal", isMetallic: true, position: { row: 8, col: 2 }, valences: [2], group: "s" },
    { symbol: "Hf", atomic: 72, mass: 178.49, names: { en: "Hafnium", ru: "Гафний", ua: "Гафній" }, category: "transition-metal", isMetallic: true, position: { row: 8, col: 4 }, valences: [4], group: "d" },
    { symbol: "Ta", atomic: 73, mass: 180.95, names: { en: "Tantalum", ru: "Тантал", ua: "Тантал" }, category: "transition-metal", isMetallic: true, position: { row: 8, col: 5 }, valences: [5], group: "d" },
    { symbol: "W", atomic: 74, mass: 183.84, names: { en: "Tungsten", ru: "Вольфрам", ua: "Вольфрам" }, category: "transition-metal", isMetallic: true, position: { row: 8, col: 6 }, valences: [6], group: "d" },
    { symbol: "Re", atomic: 75, mass: 186.21, names: { en: "Rhenium", ru: "Рений", ua: "Реній" }, category: "transition-metal", isMetallic: true, position: { row: 8, col: 7 }, valences: [4, 6, 7], group: "d" },
    { symbol: "Os", atomic: 76, mass: 190.23, names: { en: "Osmium", ru: "Осмий", ua: "Осмій" }, category: "transition-metal", isMetallic: true, position: { row: 8, col: 8 }, valences: [3, 4, 6, 8], group: "d" },
    { symbol: "Ir", atomic: 77, mass: 192.22, names: { en: "Iridium", ru: "Иридий", ua: "Іридій" }, category: "transition-metal", isMetallic: true, position: { row: 8, col: 9 }, valences: [3, 4, 6], group: "d" },
    { symbol: "Pt", atomic: 78, mass: 195.08, names: { en: "Platinum", ru: "Платина", ua: "Платина" }, category: "transition-metal", isMetallic: true, position: { row: 8, col: 10 }, valences: [2, 4], group: "d" },

    { symbol: "Au", atomic: 79, mass: 196.97, names: { en: "Gold", ru: "Золото", ua: "Золото" }, category: "transition-metal", isMetallic: true, position: { row: 9, col: 1 }, valences: [1, 3], group: "d" },
    { symbol: "Hg", atomic: 80, mass: 200.59, names: { en: "Mercury", ru: "Ртуть", ua: "Ртуть" }, category: "transition-metal", isMetallic: true, position: { row: 9, col: 2 }, valences: [1, 2], group: "d" },
    { symbol: "Tl", atomic: 81, mass: 204.38, names: { en: "Thallium", ru: "Таллий", ua: "Талій" }, category: "post-transition-metal", isMetallic: true, position: { row: 9, col: 3 }, valences: [1, 3], group: "p" },
    { symbol: "Pb", atomic: 82, mass: 207.2, names: { en: "Lead", ru: "Свинец", ua: "Свинець" }, category: "post-transition-metal", isMetallic: true, position: { row: 9, col: 4 }, valences: [2, 4], group: "p" },
    { symbol: "Bi", atomic: 83, mass: 208.98, names: { en: "Bismuth", ru: "Висмут", ua: "Бісмут" }, category: "post-transition-metal", isMetallic: true, position: { row: 9, col: 5 }, valences: [3, 5], group: "p" },
    { symbol: "Po", atomic: 84, mass: 209, names: { en: "Polonium", ru: "Полоний", ua: "Полоній" }, category: "metalloid", isMetallic: false, position: { row: 9, col: 6 }, valences: [2, 4], group: "p" },
    { symbol: "At", atomic: 85, mass: 210, names: { en: "Astatine", ru: "Астат", ua: "Астат" }, category: "halogen", isMetallic: false, position: { row: 9, col: 7 }, valences: [-1, 1, 3, 5, 7], group: "p" },
    { symbol: "Rn", atomic: 86, mass: 222, names: { en: "Radon", ru: "Радон", ua: "Радон" }, category: "noble-gas", isMetallic: false, position: { row: 9, col: 8 }, valences: [0], group: "p" },

    // Lanthanides (57-71) - moved to row 16
    { symbol: "La", atomic: 57, mass: 138.91, names: { en: "Lanthanum", ru: "Лантан", ua: "Лантан" }, category: "lanthanide", isMetallic: true, position: { row: 13, col: 1 }, valences: [3], group: "f" },
    { symbol: "Ce", atomic: 58, mass: 140.12, names: { en: "Cerium", ru: "Церий", ua: "Церій" }, category: "lanthanide", isMetallic: true, position: { row: 13, col: 2 }, valences: [3, 4], group: "f" },
    { symbol: "Pr", atomic: 59, mass: 140.91, names: { en: "Praseodymium", ru: "Празеодим", ua: "Празеодим" }, category: "lanthanide", isMetallic: true, position: { row: 13, col: 3 }, valences: [3, 4], group: "f" },
    { symbol: "Nd", atomic: 60, mass: 144.24, names: { en: "Neodymium", ru: "Неодим", ua: "Неодим" }, category: "lanthanide", isMetallic: true, position: { row: 13, col: 4 }, valences: [3], group: "f" },
    { symbol: "Pm", atomic: 61, mass: 145, names: { en: "Promethium", ru: "Прометий", ua: "Прометій" }, category: "lanthanide", isMetallic: true, position: { row: 13, col: 5 }, valences: [3], group: "f" },
    { symbol: "Sm", atomic: 62, mass: 150.36, names: { en: "Samarium", ru: "Самарий", ua: "Самарій" }, category: "lanthanide", isMetallic: true, position: { row: 13, col: 6 }, valences: [2, 3], group: "f" },
    { symbol: "Eu", atomic: 63, mass: 151.96, names: { en: "Europium", ru: "Европий", ua: "Європій" }, category: "lanthanide", isMetallic: true, position: { row: 13, col: 7 }, valences: [2, 3], group: "f" },
    { symbol: "Gd", atomic: 64, mass: 157.25, names: { en: "Gadolinium", ru: "Гадолиний", ua: "Гадоліній" }, category: "lanthanide", isMetallic: true, position: { row: 13, col: 8 }, valences: [3], group: "f" },
    { symbol: "Tb", atomic: 65, mass: 158.93, names: { en: "Terbium", ru: "Тербий", ua: "Тербій" }, category: "lanthanide", isMetallic: true, position: { row: 13, col: 9 }, valences: [3, 4], group: "f" },
    { symbol: "Dy", atomic: 66, mass: 162.50, names: { en: "Dysprosium", ru: "Диспрозий", ua: "Диспрозій" }, category: "lanthanide", isMetallic: true, position: { row: 13, col: 10 }, valences: [3], group: "f" },
    { symbol: "Ho", atomic: 67, mass: 164.93, names: { en: "Holmium", ru: "Гольмий", ua: "Гольмій" }, category: "lanthanide", isMetallic: true, position: { row: 14, col: 1 }, valences: [3], group: "f" },
    { symbol: "Er", atomic: 68, mass: 167.26, names: { en: "Erbium", ru: "Эрбий", ua: "Ербій" }, category: "lanthanide", isMetallic: true, position: { row: 14, col: 2 }, valences: [3], group: "f" },
    { symbol: "Tm", atomic: 69, mass: 168.93, names: { en: "Thulium", ru: "Тулий", ua: "Тулій" }, category: "lanthanide", isMetallic: true, position: { row: 14, col: 3 }, valences: [3], group: "f" },
    { symbol: "Yb", atomic: 70, mass: 173.05, names: { en: "Ytterbium", ru: "Иттербий", ua: "Ітербій" }, category: "lanthanide", isMetallic: true, position: { row: 14, col: 4 }, valences: [2, 3], group: "f" },
    { symbol: "Lu", atomic: 71, mass: 174.97, names: { en: "Lutetium", ru: "Лютеций", ua: "Лютецій" }, category: "lanthanide", isMetallic: true, position: { row: 14, col: 5 }, valences: [3], group: "f" },

    // Actinides (89-103) - moved to row 17
    { symbol: "Ac", atomic: 89, mass: 227, names: { en: "Actinium", ru: "Актиний", ua: "Актиній" }, category: "actinide", isMetallic: true, position: { row: 15, col: 1 }, valences: [3], group: "f" },
    { symbol: "Th", atomic: 90, mass: 232.04, names: { en: "Thorium", ru: "Торий", ua: "Торій" }, category: "actinide", isMetallic: true, position: { row: 15, col: 2 }, valences: [4], group: "f" },
    { symbol: "Pa", atomic: 91, mass: 231.04, names: { en: "Protactinium", ru: "Протактиний", ua: "Протактиній" }, category: "actinide", isMetallic: true, position: { row: 15, col: 3 }, valences: [4, 5], group: "f" },
    { symbol: "U", atomic: 92, mass: 238.03, names: { en: "Uranium", ru: "Уран", ua: "Уран" }, category: "actinide", isMetallic: true, position: { row: 15, col: 4 }, valences: [3, 4, 5, 6], group: "f" },
    { symbol: "Np", atomic: 93, mass: 237, names: { en: "Neptunium", ru: "Нептуний", ua: "Нептуній" }, category: "actinide", isMetallic: true, position: { row: 15, col: 5 }, valences: [3, 4, 5, 6], group: "f" },
    { symbol: "Pu", atomic: 94, mass: 244, names: { en: "Plutonium", ru: "Плутоний", ua: "Плутоній" }, category: "actinide", isMetallic: true, position: { row: 15, col: 6 }, valences: [3, 4, 5, 6], group: "f" },
    { symbol: "Am", atomic: 95, mass: 243, names: { en: "Americium", ru: "Америций", ua: "Америцій" }, category: "actinide", isMetallic: true, position: { row: 15, col: 7 }, valences: [3, 4, 5, 6], group: "f" },
    { symbol: "Cm", atomic: 96, mass: 247, names: { en: "Curium", ru: "Кюрий", ua: "Кюрій" }, category: "actinide", isMetallic: true, position: { row: 15, col: 8 }, valences: [3], group: "f" },
    { symbol: "Bk", atomic: 97, mass: 247, names: { en: "Berkelium", ru: "Берклий", ua: "Берклій" }, category: "actinide", isMetallic: true, position: { row: 15, col: 9 }, valences: [3, 4], group: "f" },
    { symbol: "Cf", atomic: 98, mass: 251, names: { en: "Californium", ru: "Калифорний", ua: "Каліфорній" }, category: "actinide", isMetallic: true, position: { row: 15, col: 10 }, valences: [3], group: "f" },
    { symbol: "Es", atomic: 99, mass: 252, names: { en: "Einsteinium", ru: "Эйнштейний", ua: "Ейнштейній" }, category: "actinide", isMetallic: true, position: { row: 16, col: 1 }, valences: [3], group: "f" },
    { symbol: "Fm", atomic: 100, mass: 257, names: { en: "Fermium", ru: "Фермий", ua: "Фермій" }, category: "actinide", isMetallic: true, position: { row: 16, col: 2 }, valences: [3], group: "f" },
    { symbol: "Md", atomic: 101, mass: 258, names: { en: "Mendelevium", ru: "Менделевий", ua: "Менделевій" }, category: "actinide", isMetallic: true, position: { row: 16, col: 3 }, valences: [3], group: "f" },
    { symbol: "No", atomic: 102, mass: 259, names: { en: "Nobelium", ru: "Нобелий", ua: "Нобелій" }, category: "actinide", isMetallic: true, position: { row: 16, col: 4 }, valences: [2, 3], group: "f" },
    { symbol: "Lr", atomic: 103, mass: 262, names: { en: "Lawrencium", ru: "Лоуренсий", ua: "Лоуренсій" }, category: "actinide", isMetallic: true, position: { row: 16, col: 5 }, valences: [3], group: "f" },

    // Row 7 (87-118, split into rows)
    { symbol: "Fr", atomic: 87, mass: 223, names: { en: "Francium", ru: "Франций", ua: "Францій" }, category: "alkali-metal", isMetallic: true, position: { row: 10, col: 1 }, valences: [1], group: "s" },
    { symbol: "Ra", atomic: 88, mass: 226, names: { en: "Radium", ru: "Радий", ua: "Радій" }, category: "alkaline-earth-metal", isMetallic: true, position: { row: 10, col: 2 }, valences: [2], group: "s" },
    { symbol: "Rf", atomic: 104, mass: 267, names: { en: "Rutherfordium", ru: "Резерфордий", ua: "Резерфордій" }, category: "transition-metal", isMetallic: true, position: { row: 10, col: 4 }, valences: [4], group: "d" },
    { symbol: "Db", atomic: 105, mass: 268, names: { en: "Dubnium", ru: "Дубний", ua: "Дубній" }, category: "transition-metal", isMetallic: true, position: { row: 10, col: 5 }, valences: [5], group: "d" },
    { symbol: "Sg", atomic: 106, mass: 269, names: { en: "Seaborgium", ru: "Сиборгий", ua: "Сиборгій" }, category: "transition-metal", isMetallic: true, position: { row: 10, col: 6 }, valences: [6], group: "d" },
    { symbol: "Bh", atomic: 107, mass: 270, names: { en: "Bohrium", ru: "Борий", ua: "Борій" }, category: "transition-metal", isMetallic: true, position: { row: 10, col: 7 }, valences: [7], group: "d" },
    { symbol: "Hs", atomic: 108, mass: 269, names: { en: "Hassium", ru: "Хассий", ua: "Гассій" }, category: "transition-metal", isMetallic: true, position: { row: 10, col: 8 }, valences: [8], group: "d" },
    { symbol: "Mt", atomic: 109, mass: 278, names: { en: "Meitnerium", ru: "Мейтнерий", ua: "Мейтнерій" }, category: "transition-metal", isMetallic: true, position: { row: 10, col: 9 }, group: "d" },
    { symbol: "Ds", atomic: 110, mass: 281, names: { en: "Darmstadtium", ru: "Дармштадтий", ua: "Дармштадтій" }, category: "transition-metal", isMetallic: true, position: { row: 10, col: 10 }, group: "d" },

    { symbol: "Rg", atomic: 111, mass: 282, names: { en: "Roentgenium", ru: "Рентгений", ua: "Рентгеній" }, category: "transition-metal", isMetallic: true, position: { row: 11, col: 1 }, group: "d" },
    { symbol: "Cn", atomic: 112, mass: 285, names: { en: "Copernicium", ru: "Коперниций", ua: "Коперницій" }, category: "transition-metal", isMetallic: true, position: { row: 11, col: 2 }, group: "d" },
    { symbol: "Nh", atomic: 113, mass: 286, names: { en: "Nihonium", ru: "Нихоний", ua: "Ніхоній" }, category: "post-transition-metal", isMetallic: true, position: { row: 11, col: 3 }, group: "p" },
    { symbol: "Fl", atomic: 114, mass: 289, names: { en: "Flerovium", ru: "Флеровий", ua: "Флеровій" }, category: "post-transition-metal", isMetallic: true, position: { row: 11, col: 4 }, group: "p" },
    { symbol: "Mc", atomic: 115, mass: 290, names: { en: "Moscovium", ru: "Московий", ua: "Московій" }, category: "post-transition-metal", isMetallic: true, position: { row: 11, col: 5 }, group: "p" },
    { symbol: "Lv", atomic: 116, mass: 293, names: { en: "Livermorium", ru: "Ливерморий", ua: "Ліверморій" }, category: "post-transition-metal", isMetallic: true, position: { row: 11, col: 6 }, group: "p" },
    { symbol: "Ts", atomic: 117, mass: 294, names: { en: "Tennessine", ru: "Теннессин", ua: "Теннессин" }, category: "halogen", isMetallic: false, position: { row: 11, col: 7 }, group: "p" },
    { symbol: "Og", atomic: 118, mass: 294, names: { en: "Oganesson", ru: "Оганесон", ua: "Оганесон" }, category: "noble-gas", isMetallic: false, position: { row: 11, col: 8 }, group: "p" }
];

// Adding full element categories for styling
const elementCategories = {
    "alkali-metal": { color: "#ff7777" },
    "alkaline-earth-metal": { color: "#ffbf00" },
    "lanthanide": { color: "#ffbfff" },
    "actinide": { color: "#ff99cc" },
    "transition-metal": { color: "#ffc0c0" },
    "post-transition-metal": { color: "#cccccc" },
    "metalloid": { color: "#cccc99" },
    "nonmetal": { color: "#a0ffa0" },
    "noble-gas": { color: "#c0ffff" },
    "halogen": { color: "#ffff99" }
};

// Function to determine if an element is metallic
function isMetallicCategory(category) {
    return isMetallic;
}

// Update elements with isMetallic property
elements.forEach(element => {
    element.isMetallic = isMetallicCategory(element.category);
});

// Export group spdf
function getGroupSpdf(element) {
    return group;
}
