### TC001 - Rejestracja użytkownika

| **ID**     | TC001 |
|------------|--------|
| **Tytuł** | Rejestracja użytkownika |
| **Warunki początkowe** | Użytkownik znajduje się na stronie rejestracji |
| **Kroki testowe** | 1. Wprowadź unikalny email<br>2. Wprowadź unikalną nazwę użytkownika<br>3. Wprowadź imię i nazwisko<br>4. Wprowadź hasło<br>5. Naciśnij przycisk **Signup** |
| **Oczekiwany rezultat** | Na ekranie pojawia się informacja o wysłaniu kodu weryfikacyjnego na podany adres e-mail oraz użytkownik zostaje przeniesiony do strony weryfikacji konta. |

---

### TC002 - Weryfikacja konta użytkownika

| **ID**     | TC002 |
|------------|--------|
| **Tytuł** | Weryfikacja konta użytkownika |
| **Warunki początkowe** | Użytkownik przeszedł pomyślnie proces rejestracji i znajduje się na stronie weryfikacji konta. System wysłał kod weryfikacyjny na podany adres email. |
| **Kroki testowe** | 1. Otwórz skrzynkę pocztową i skopiuj kod weryfikacyjny<br>2. Wklej kod weryfikacyjny do pola input z napisem **Verification Code**<br>3. Naciśnij przycisk **Verify** |
| **Oczekiwany rezultat** | System wyświetla komunikat potwierdzający udaną weryfikację konta, a użytkownik zostaje przeniesiony do ekranu logowania. |

---

### TC003 - Dodawanie posta

| **ID**     | TC003 |
|------------|--------|
| **Tytuł** | Dodawanie posta |
| **Warunki początkowe** | Użytkownik jest zalogowany na konto i znajduje się na stronie głównej aplikacji (**Home Page**) |
| **Kroki testowe** | 1. Naciśnij przycisk **Add Post**<br>2. System wyświetla okno kontekstowe umożliwiające dodanie nowego posta<br>3. Wprowadź tekst w polu input z napisem **What's happening**<br>4. Wybierz kategorię z rozwijanej listy z napisem **Choose a category**<br>5. *(Opcjonalnie)* Naciśnij ikonę zdjęcia i wybierz plik zdjęciowy, który chcesz dodać do posta<br>6. Naciśnij przycisk **Post**, aby opublikować posta |
| **Oczekiwany rezultat** | Nowy post pojawia się na stronie głównej aplikacji (**Home Page**). |

---

### TC004 - Sortowanie postów według kategorii

| **ID**     | TC004 |
|------------|--------|
| **Tytuł** | Sortowanie postów według kategorii |
| **Warunki początkowe** | Użytkownik jest zalogowany na konto i znajduje się na stronie głównej aplikacji (**Home Page**) |
| **Kroki testowe** | 1. *(Opcjonalnie)* Wpisz nazwę kategorii w pole input z napisem **Search categories**<br>2. Naciśnij dowolny przycisk z nazwą kategorii na panelu bocznym po prawej stronie |
| **Oczekiwany rezultat** | System wyświetla tylko posty należące do wybranej kategorii. |

---

### TC005 - Dodawanie komentarza pod postem

| **ID**     | TC005 |
|------------|--------|
| **Tytuł** | Dodawanie komentarza pod postem |
| **Warunki początkowe** | Użytkownik jest zalogowany na konto i znajduje się na stronie głównej aplikacji (**Home Page**) |
| **Kroki testowe** | 1. Wybierz post, który chcesz skomentować<br>2. Pod wybranym postem wpisz treść komentarza<br>3. Naciśnij przycisk **Enter** lub kliknij ikonę przesyłania komentarza |
| **Oczekiwany rezultat** | Nowy komentarz pojawia się pod wybranym postem na stronie głównej aplikacji. |

---

### TC006 - Edycja posta

| **ID**     | TC006 |
|------------|--------|
| **Tytuł** | Edycja posta |
| **Warunki początkowe** | Użytkownik jest zalogowany na konto i znajduje się na stronie głównej aplikacji (**Home Page**) |
| **Kroki testowe** | 1. Wybierz post, który chcesz edytować<br>2. Jeśli jesteś autorem posta lub administratorem, naciśnij ikonę edycji<br>3. *(Opcjonalnie)* Zmień treść posta<br>4. *(Opcjonalnie)* Zmień kategorię przypisaną do posta<br>5. Naciśnij przycisk **Update** |
| **Oczekiwany rezultat** | Zaktualizowana treść i kategoria posta są widoczne na stronie głównej aplikacji. |

---

### TC007 - Usuwanie posta

| **ID**     | TC007 |
|------------|--------|
| **Tytuł** | Usuwanie posta |
| **Warunki początkowe** | Użytkownik jest zalogowany na konto i znajduje się na stronie głównej aplikacji (**Home Page**) |
| **Kroki testowe** | 1. Wybierz post, który chcesz usunąć<br>2. Jeśli jesteś autorem posta lub administratorem, naciśnij ikonę kosza |
| **Oczekiwany rezultat** | Post znika ze strony głównej, a system wyświetla komunikat potwierdzający usunięcie. |

---

### TC008 - Polubienie posta

| **ID**     | TC008 |
|------------|--------|
| **Tytuł** | Polubienie posta |
| **Warunki początkowe** | Użytkownik jest zalogowany na konto i znajduje się na stronie głównej aplikacji (**Home Page**) |
| **Kroki testowe** | 1. Wybierz post, który chcesz polubić<br>2. Naciśnij ikonę serca |
| **Oczekiwany rezultat** | Ikona serca zmienia kolor, a liczba polubień zwiększa się o 1. |

---

### TC009 - Wylogowanie użytkownika

| **ID**     | TC009 |
|------------|--------|
| **Tytuł** | Wylogowanie użytkownika |
| **Warunki początkowe** | Użytkownik jest zalogowany na konto i znajduje się na stronie głównej aplikacji (**Home Page**) |
| **Kroki testowe** | 1. Kliknij przycisk z ikoną wylogowania |
| **Oczekiwany rezultat** | Użytkownik zostaje przeniesiony do strony rejestracji/logowania. |

---

### TC010 - Zmiana hasła użytkownika

| **ID**     | TC010 |
|------------|--------|
| **Tytuł** | Zmiana hasła użytkownika |
| **Warunki początkowe** | Użytkownik znajduje się na stronie logowania |
| **Kroki testowe** | 1. Kliknij link **Forgot Password?**<br>2. Wpisz adres e-mail<br>3. Kliknij **Send reset link**<br>4. Kliknij link z e-maila<br>5. Wpisz nowe hasło |
| **Oczekiwany rezultat** | Na ekranie pojawia się komunikat potwierdzający zmianę hasła. |
