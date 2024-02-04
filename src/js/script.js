// Получаем ссылки на элементы
const lengthInput = document.getElementById("length");
const lengthValue = document.getElementById("length-value");
const generateButton = document.getElementById("generate");
const passwordElement = document.getElementById("password");
const lowercaseCheckbox = document.getElementById("lowercase");
const uppercaseCheckbox = document.getElementById("uppercase");
const numbersCheckbox = document.getElementById("numbers");
const specialCheckbox = document.getElementById("special");
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
const copyButton = document.getElementById("copy-button");

// Константы для символов
const lowerCaseChars = "abcdefghijklmnopqrstuvwxyz";
const upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numberChars = "0123456789";
const specialChars = '!@#$%^&*()_+{}|[]\\:;"<>?,./';

// Функция генерации пароля с использованием window.crypto.getRandomValues()
function generatePassword() {
  const length = lengthInput.value;
  let hasLowerCase = lowercaseCheckbox.checked;
  let hasUpperCase = uppercaseCheckbox.checked;
  let hasNumbers = numbersCheckbox.checked;
  let hasSpecialChars = specialCheckbox.checked;

  let passwordChars = "";
  if (hasLowerCase) passwordChars += lowerCaseChars;
  if (hasUpperCase) passwordChars += upperCaseChars;
  if (hasNumbers) passwordChars += numberChars;
  if (hasSpecialChars) passwordChars += specialChars;

  // Если все чекбоксы с символами отключены, используем все доступные символы
  if (!passwordChars) {
    passwordChars = lowerCaseChars;
  }

  // Создаём массив байтов размером с длину пароля
  const passwordByteArray = new Uint32Array(length);

// Заполняем массив байтов псевдослучайными числами с использованием криптографически стойкого алгоритма
  window.crypto.getRandomValues(passwordByteArray);

  let password = "";
  // Преобразуем массив байтов в строку символов
  for (let i = 0; i < length; i++) {
    password += passwordChars[passwordByteArray[i] % passwordChars.length];
  }

  return password;
}

// Функция обновления значения длины пароля
function updateLengthValue() {
  lengthValue.textContent = lengthInput.value;
}

// Функция обновления пароля при изменении настроек
function updatePassword() {
  const password = generatePassword();
  passwordElement.textContent = password || "";
}

// Функция обновления пароля при клике на кнопку
generateButton.addEventListener("click", () => {
  updatePassword();
});

// Функция обновления пароля при изменении длины
lengthInput.addEventListener("input", () => {
  updateLengthValue();
  updatePassword();
});

// Функция отслеживания количества отмеченных чекбоксов
function updateCheckedCount() {
  let checkedCount = 0;
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      checkedCount++;
    }
  });

  if (checkedCount === checkboxes.length) {
    lowercaseCheckbox.checked = true;
  }
}

// Инициализация страницы
updateLengthValue();
updatePassword();

// Выбрать по умолчанию буквы нижнего регистра и цифры
lowercaseCheckbox.checked = true;
numbersCheckbox.checked = true;

// Устанавливаем обработчик события на каждый чекбокс
checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", (event) => {
    // Обновляем пароль при изменении настроек
    updatePassword();

    // Если ни один чекбокс не отмечен, отметить чекбокс с буквами нижнего регистра
    if ([...checkboxes].filter((checkbox) => checkbox.checked).length === 0) {
      lowercaseCheckbox.checked = true;
    }
  });
});

// Функция копирования пароля в буфер обмена
function copyPasswordToClipboard() {
  const password = passwordElement.textContent;
  navigator.clipboard.writeText(password).then(
    () => {
      alert("Пароль скопирован в буфер обмена");
    },
    () => {
      alert("Ошибка копирования пароля");
    }
  );
}

// Функция обновления кнопки копирования пароля
function updateCopyButton() {
  const password = passwordElement.textContent;
  if (password) {
    copyButton.disabled = false;
  } else {
    copyButton.disabled = true;
  }
}

// Обновление кнопки копирования пароля при изменении пароля
updateCopyButton();

// Клик на кнопку копирования пароля
copyButton.addEventListener("click", () => {
  copyPasswordToClipboard();
});

// Обновление кнопки копирования пароля при изменении пароля
passwordElement.addEventListener("input", () => {
  updateCopyButton();
});
