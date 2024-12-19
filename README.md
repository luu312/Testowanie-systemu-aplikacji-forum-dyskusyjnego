| **ID**     | TC001 |
|------------|--------|
| **Tytuł** | Rejestracja użytkownika |
| **Warunki początkowe** | Użytkownik znajduje się na stronie rejestracji |
| **Kroki testowe** | 1. Wprowadź unikalny email<br>2. Wprowadź unikalną nazwę użytkownika<br>3. Wprowadź imię i nazwisko<br>4. Wprowadź hasło<br>5. Naciśnij przycisk **Signup** |
| **Oczekiwany rezultat** | System wysyła email z kodem weryfikacyjnym na podany adres mailowy oraz przenosi użytkownika do ścieżki weryfikacji konta. |



| **ID**     | TC002 |
|------------|--------|
| **Tytuł** | Weryfikacja konta użytkownika |
| **Warunki początkowe** | Użytkownik przeszedł pomyślnie proces rejestracji i znajduje się na stronie weryfikacji konta. System wysłał kod weryfikacyjny na podany adres email. |
| **Kroki testowe** | 1. Otwórz skrzynkę pocztową i skopiuj kod weryfikacyjny<br>2. Wklej kod weryfikacyjny do pola input z napisem **Verification Code**<br>3. Naciśnij przycisk **Verify** |
| **Oczekiwany rezultat** | System potwierdza weryfikację konta, a użytkownik może się zalogować. |



| **ID**     | TC003 |
|------------|--------|
| **Tytuł** | Dodawanie posta |
| **Warunki początkowe** | Użytkownik jest zalogowany na konto i znajduje się na stronie głównej aplikacji (**Home Page**) |
| **Kroki testowe** | 1. Naciśnij przycisk **Add Post**<br>2. System wyświetla okno kontekstowe umożliwiające dodanie nowego posta<br>3. Wprowadź tekst w polu input z napisem **What's happening**<br>4. Wybierz kategorię z rozwijanej listy z napisem **Choose a category**<br>5. *(Opcjonalnie)* Naciśnij ikonę zdjęcia i wybierz plik zdjęciowy, który chcesz dodać do posta<br>6. Naciśnij przycisk **Post**, aby opublikować posta |
| **Oczekiwany rezultat** | System zapisuje post w bazie danych i wyświetla go na stronie głównej aplikacji (**Home Page**) |



| **ID**     | TC004 |
|------------|--------|
| **Tytuł** | Sortowanie postów według kategorii |
| **Warunki początkowe** | Użytkownik jest zalogowany na konto i znajduje się na stronie głównej aplikacji (**Home Page**) |
| **Kroki testowe** | 1. *(Opcjonalnie)* Wpisz nazwę kategorii w pole input z napisem **Search categories**<br>2. Naciśnij dowolny przycisk z nazwą kategorii na panelu bocznym po prawej stronie |
| **Oczekiwany rezultat** | System wyświetla posty, które są przypisane do wybranej kategorii |



| **ID**     | TC005 |
|------------|--------|
| **Tytuł** | Dodawanie komentarza pod postem |
| **Warunki początkowe** | Użytkownik jest zalogowany na konto i znajduje się na stronie głównej aplikacji (**Home Page**) |
| **Kroki testowe** | 1. Wybierz post, który chcesz skomentować<br>2. Pod wybranym postem wpisz treść komentarza<br>3. Naciśnij przycisk **Enter** lub kliknij myszką na ikonę symbolizującą przesyłanie posta |
| **Oczekiwany rezultat** | System zapisuje komentarz w bazie danych i przypisuje go do odpowiedniego posta. |



| **ID**     | TC006 |
|------------|--------|
| **Tytuł** | Edycja posta |
| **Warunki początkowe** | Użytkownik jest zalogowany na konto i znajduje się na stronie głównej aplikacji (**Home Page**) |
| **Kroki testowe** | 1. Wybierz post, który chcesz edytować<br>2. Jeśli jesteś autorem posta lub administratorem, naciśnij ikonę symbolizującą edycję, która znajduje się w prawym dolnym rogu posta<br>3. *(Opcjonalnie)* Zmień treść posta<br>4. *(Opcjonalnie)* Zmień kategorię przypisaną do posta<br>5. Naciśnij przycisk **Update** |
| **Oczekiwany rezultat** | System aktualizuje treść oraz kategorię wybranego posta, a następnie zapisuje zaktualizowane dane w bazie danych. |




| **ID**           | TC007                                               |
|------------------|-----------------------------------------------------|
| **Tytuł**        | Usuwanie posta                                      |
| **Warunki początkowe** | Użytkownik jest **zalogowany na konto** i znajduje się na stronie głównej aplikacji **(Home Page)** |
| **Kroki testowe** | 1. Wybierz post, który chcesz usunąć.<br>2. Jeśli jesteś autorem posta lub administratorem, naciśnij ikonę symbolizującą kosz, która znajduje się w prawym dolnym rogu posta. |
| **Oczekiwany rezultat** | System **usuwa wybrany post** z bazy danych. |

---




| **ID**           | TC008                                               |
|------------------|-----------------------------------------------------|
| **Tytuł**        | Polubienie posta                                    |
| **Warunki początkowe** | Użytkownik jest **zalogowany na konto** i znajduje się na stronie głównej aplikacji **(Home Page)** |
| **Kroki testowe** | 1. Wybierz post, który chcesz polubić.<br>2. Naciśnij ikonę symbolizującą serce, która znajduje się w lewym dolnym rogu wybranego posta. |
| **Oczekiwany rezultat** | System **dodaje polubienie** do wybranego posta i zapisuje identyfikator tego posta w bazie danych, przypisanej do użytkownika, który dokonał polubienia. |




| **ID**           | TC009                                               |
|------------------|-----------------------------------------------------|
| **Tytuł**        | Wylogowanie użytkownika                             |
| **Warunki początkowe** | Użytkownik jest **zalogowany na konto** i znajduje się na stronie głównej aplikacji **(Home Page)** |
| **Kroki testowe** | 1. Kliknij przycisk z ikoną wylogowania znajdujący się po prawej stronie w panelu nawigacyjnym. |
| **Oczekiwany rezultat** | System **usuwa token weryfikacyjny** z plików cookie oraz **przenosi użytkownika** do panelu rejestracyjnego. |

---


| **ID**                | TC010                                                    |
|------------------------|----------------------------------------------------------|
| **Tytuł**             | Zmiana hasła użytkownika                                 |
| **Warunki początkowe**| Użytkownik **znajduje się na stronie logowania**.        |
| **Kroki testowe**     | 1. Kliknij na link **Forgot Password?**.<br>2. W polu **Email** wpisz swój adres e-mail.<br>3. Kliknij przycisk **Send reset link**.<br>4. Otwórz skrzynkę odbiorczą adresu e-mail podanego podczas rejestracji i kliknij link do resetowania hasła.<br>5. W polu **New Password** wpisz nowe hasło. |
| **Oczekiwany rezultat**| System **zmienia hasło użytkownika** i potwierdza udaną zmianę. |

