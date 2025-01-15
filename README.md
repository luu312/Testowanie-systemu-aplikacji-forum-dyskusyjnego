# Testowanie i jakość oprogramowania  
**Autor**: Jakub Chamielec  

## Temat: Testowanie systemu aplikacji forum dyskusyjnego  

### Opis projektu  
Projekt stanowi część systemu opracowanego w ramach pracy inżynierskiej pt. *Projekt i implementacja forum dyskusyjnego*.  
Niniejsza część aplikacji obejmuje implementację następujących funkcjonalności:  

- **Rejestracja i logowanie użytkowników** – umożliwienie użytkownikom zakładania kont oraz logowania się w celu korzystania z forum.  
- **Publikowanie postów** – tworzenie nowych wątków dyskusyjnych przez użytkowników.  
- **Edycja postów** – możliwość modyfikowania treści własnych postów.  
- **Publikowanie komentarzy** – użytkownicy mogą komentować istniejące posty, uczestnicząc w dyskusji.  
- **Edycja komentarzy** – możliwość modyfikowania treści własnych komentarzy.  
- **Usuwanie postów i komentarzy** – funkcjonalność pozwalająca użytkownikom na usunięcie swoich postów i komentarzy.  
- **Sortowanie postów według kategorii** – organizacja postów w kategorie tematyczne, co ułatwia użytkownikom odnajdywanie interesujących ich treści.  

Głównym celem tej części systemu jest umożliwienie przetestowania zaimplementowanych funkcjonalności przy użyciu:  
- testów integracyjnych,  
- testów jednostkowych,  
- testów manualnych,  

aby zapewnić poprawność działania, współdziałanie modułów oraz intuicyjność interfejsu użytkownika.  

---

### Główne funkcjonalności  
1. **Rejestracja i logowanie użytkowników**  
2. **Publikowanie postów**  
3. **Edycja postów**  
4. **Publikowanie komentarzy**  
5. **Edycja komentarzy**  
6. **Usuwanie postów i komentarzy**  
7. **Sortowanie postów według kategorii**  

---

### Uruchomienie projektu  
Aby uruchomić backend oraz frontend aplikacji, należy użyć następującej komendy:  

```bash
npm run dev
```

# Dokumentacja Testów

## 1. Testy Jednostkowe dla Kontrolera `AuthController`

### Lokalizacja
`backend/tests/auth.controller.test.js`

### Opis
Testy weryfikują funkcjonalność rejestracji użytkownika w kontrolerze `AuthController`.

---

### **Walidacja nieprawidłowego formatu adresu e-mail**
- **Test:** `it("should return 400 if email format is invalid")`
- **Scenariusz:** Test sprawdza, czy kontroler poprawnie obsługuje błędnie sformatowany adres e-mail podczas rejestracji.
- **Cel:** Upewnić się, że użytkownik otrzymuje status HTTP `400` i komunikat błędu `"Invalid email format"`.
- **Dlaczego:** Zapobiega przyjmowaniu nieprawidłowych adresów e-mail, które mogłyby wpłynąć na funkcjonalność weryfikacji e-mail.

---

### **Sprawdzanie unikalności nazwy użytkownika**
- **Test:** `it("should return 400 if username is already taken")`
- **Scenariusz:** Kontroler powinien zwrócić błąd, gdy nowy użytkownik próbuje zarejestrować się z już istniejącą nazwą użytkownika.
- **Cel:** Upewnić się, że kontroler zwraca status HTTP `400` i komunikat `"Username is already taken"`.
- **Dlaczego:** Zapewnia unikalność nazw użytkownika, kluczową dla identyfikacji w systemie.

---

### **Sprawdzanie unikalności adresu e-mail**
- **Test:** `it("should return 400 if email is already taken")`
- **Scenariusz:** Nowy użytkownik próbuje zarejestrować się z już istniejącym adresem e-mail.
- **Cel:** Potwierdzić, że kontroler zwraca status HTTP `400` z komunikatem `"Email is already taken"`.
- **Dlaczego:** Zapobiega konfliktom i zagrożeniom bezpieczeństwa wynikającym z wielokrotnego użycia tego samego e-maila.

---

### **Minimalna długość hasła**
- **Test:** `it("should return 400 if password is less than 6 characters")`
- **Scenariusz:** Hasło użytkownika jest krótsze niż 6 znaków.
- **Cel:** Upewnić się, że kontroler odrzuca takie dane z komunikatem błędu.
- **Dlaczego:** Krótkie hasła są podatne na ataki, co zagraża bezpieczeństwu systemu.

---

### **Poprawne utworzenie nowego użytkownika i wysłanie e-maila weryfikacyjnego**
- **Test:** `it("should create a new user and send verification email")`
- **Scenariusz:** Dane użytkownika są poprawne i przesyłane do kontrolera.
- **Cel:**
  - Upewnić się, że użytkownik jest tworzony w bazie danych.
  - Zweryfikować status HTTP `201`.
  - Sprawdzić, czy funkcja `sendVerificationEmail` została wywołana.
- **Dlaczego:** Zapewnia, że proces rejestracji działa poprawnie, a użytkownik otrzymuje powiadomienia.

---

### Zastosowane Techniki
- **Mockowanie:**
  - Modelu MongoDB (`User`).
  - Funkcji pomocniczych (`sendVerificationEmail`).
- **Oczyszczanie danych testowych:** za pomocą `afterEach`.

---

## 2. Testy Integracyjne dla Funkcji `getPostsByCategory`

### Lokalizacja
`backend/tests/category.controller.unit.test.js`

### Opis
Testy weryfikują działanie funkcji, która zwraca posty z określonej kategorii.

---

### **Pobranie postów dla prawidłowego `categoryId`**
- **Test:** `it("should return posts for a valid categoryId")`
- **Scenariusz:** Kiedy istnieją posty przypisane do kategorii, powinny one zostać zwrócone.
- **Cel:** Sprawdzić, czy kontroler zwraca status HTTP `200` i listę postów.
- **Dlaczego:** Zapewnia poprawność działania funkcji pobierania postów według kategorii.

---

### **Zwrócenie pustej tablicy, gdy brak postów w kategorii**
- **Test:** `it("should return an empty array if no posts are found")`
- **Scenariusz:** Brak postów dla podanego `categoryId`.
- **Cel:** Upewnić się, że odpowiedź zawiera pustą tablicę i status HTTP `200`.
- **Dlaczego:** Gwarantuje, że API obsługuje puste wyniki poprawnie, bez generowania błędów.

---

### **Obsługa błędów bazy danych (zwrócenie błędu 500)**
- **Test:** `it("should return a 500 error if an exception is thrown")`
- **Scenariusz:** Podczas pobierania postów występuje błąd w bazie danych.
- **Cel:** Sprawdzić, czy kontroler zwraca status HTTP `500` i komunikat `"Internal Server Error"`.
- **Dlaczego:** Obsługa wyjątków zapobiega awariom aplikacji.

---

### Zastosowane Techniki
- **Mockowanie:**
  - Modelu `Post` z funkcjami `.find()` i `.populate()`.
- **Walidacja:**
  - Odpowiedzi HTTP.
  - Zwracanych danych.

---

## 3. Testy Integracyjne dla Kontrolera `PostController`

### Lokalizacja
`backend/tests/post.controller.test.js`

### Opis
Testy sprawdzają funkcjonalność tworzenia nowych postów.

---

### **Poprawne utworzenie posta z tekstem i obrazem**
- **Test:** `it("should create a new post with text and image")`
- **Scenariusz:** Użytkownik przesyła poprawne dane, w tym obraz i tekst.
- **Cel:**
  - Sprawdzić, czy post jest zapisywany w bazie danych.
  - Zweryfikować, czy post zawiera poprawny adres URL obrazu.
  - Upewnić się, że post jest przypisany do odpowiedniej kategorii.
- **Dlaczego:** Zapewnia integralność funkcjonalności tworzenia postów.

---

### **Obsługa błędów walidacji: brak tekstu lub obrazu**
- **Test:** `it("should return 400 if text and image are missing")`
- **Scenariusz:** Żaden z kluczowych elementów (tekst/obraz) nie jest podany.
- **Cel:** Upewnić się, że kontroler zwraca status HTTP `400` i komunikat `"Text or image is required"`.
- **Dlaczego:** Zapobiega tworzeniu postów bez treści.

---

### **Obsługa błędów walidacji: brak kategorii**
- **Test:** `it("should return 400 if category is missing")`
- **Scenariusz:** Pole `categoryId` jest puste.
- **Cel:** Zweryfikować, czy odpowiedź zawiera status HTTP `400` i komunikat `"Category is required"`.
- **Dlaczego:** Każdy post musi być przypisany do kategorii.

---

### **Obsługa błędów walidacji: brak autoryzacji**
- **Test:** `it("should return 401 if user is not authenticated")`
- **Scenariusz:** Użytkownik nie jest zalogowany.
- **Cel:** Upewnić się, że API zwraca status HTTP `401` i komunikat `"Not authorized, no token"`.
- **Dlaczego:** Chroni endpoint przed nieautoryzowanym dostępem.

---

### Zastosowane Techniki
- **Testy integracyjne z MongoDB:** Z wykorzystaniem funkcji `beforeAll` i `afterAll`.
- **Mockowanie Cloudinary:** Obsługa przesyłania obrazów.
- **Ustawianie tokenów JWT:** Testowanie autoryzacji użytkownika.

---

## 4. Testy Jednostkowe dla Funkcji `commentOnPost`

### Lokalizacja
`backend/tests/post.controller.unit.test.js`

### Opis
Testy weryfikują funkcjonalność dodawania komentarzy do postów.

---

### **Obsługa błędu braku tekstu komentarza**
- **Test:** `it("should return 400 if comment text is missing")`
- **Scenariusz:** Tekst komentarza nie został przesłany w żądaniu.
- **Cel:** Zweryfikować, czy kontroler zwraca status HTTP `400` i komunikat `"Comment text is required"`.
- **Dlaczego:** Chroni przed dodawaniem pustych komentarzy.

---

### **Obsługa błędu, gdy post nie istnieje**
- **Test:** `it("should return 404 if post is not found")`
- **Scenariusz:** Żądanie zawiera `postId`, który nie istnieje w bazie danych.
- **Cel:** Upewnić się, że kontroler zwraca status HTTP `404` i komunikat `"Post not found"`.
- **Dlaczego:** Zapewnia właściwą obsługę nieprawidłowych identyfikatorów postów.

---

### **Dodanie komentarza do posta i zapisanie go**
- **Test:** `it("should add a comment and return 201")`
- **Scenariusz:** Użytkownik przesyła poprawny tekst komentarza i istniejące `postId`.
- **Cel:**
  - Sprawdzić, czy komentarz jest dodawany do listy komentarzy postu.
  - Zweryfikować zapis komentarza w bazie danych.
  - Upewnić się, że kontroler zwraca status HTTP `201`.
- **Dlaczego:** Kluczowa funkcjonalność komentowania musi działać poprawnie.

---

### **Obsługa błędu podczas zapisywania komentarza**
- **Test:** `it("should return 500 if there is an error saving the post")`
- **Scenariusz:** Występuje problem podczas zapisu danych do bazy.
- **Cel:** Sprawdzić, czy kontroler zwraca status HTTP `500` i komunikat `"Internal Server Error"`.
- **Dlaczego:** Chroni przed awariami aplikacji w przypadku problemów z bazą danych.

---

### Zastosowane Techniki
- **Mockowanie modelu `Post`:** Symulacja metod, takich jak `findById` i `save`.
- **Mockowanie powiadomień:** Symulacja systemu notyfikacji.

---

## 5. Testy Jednostkowe dla Funkcji `likeUnlikePost`

### Lokalizacja
`backend/tests/post.controller.unit.test.js`

### Opis
Testy weryfikują funkcjonalność polubień i cofania polubień postów.

---

### **Obsługa błędu, gdy post nie istnieje**
- **Test:** `it("should return 404 if post is not found")`
- **Scenariusz:** Przekazano `postId`, który nie istnieje w bazie danych.
- **Cel:** Sprawdzić, czy kontroler zwraca status HTTP `404` i komunikat `"Post not found"`.
- **Dlaczego:** Gwarantuje właściwą obsługę błędnych identyfikatorów postów.

---

### **Obsługa błędu, gdy użytkownik nie istnieje**
- **Test:** `it("should return 404 if user is not found")`
- **Scenariusz:** Token JWT należy do użytkownika, który nie istnieje.
- **Cel:** Zweryfikować, czy odpowiedź zawiera status HTTP `404` i komunikat `"User not found"`.
- **Dlaczego:** Chroni system przed problemami wynikającymi z nieprawidłowych danych użytkownika.

---

### **Polubienie posta**
- **Test:** `it("should like a post and return 200")`
- **Scenariusz:** Autoryzowany użytkownik przesyła żądanie polubienia istniejącego posta.
- **Cel:**
  - Sprawdzić, czy użytkownik zostaje dodany do listy `likes` w poście.
  - Zweryfikować, że kontroler zwraca status HTTP `200`.
- **Dlaczego:** Zapewnia poprawność funkcjonalności polubień.

---

### **Cofnięcie polubienia posta**
- **Test:** `it("should unlike a post and return 200")`
- **Scenariusz:** Autoryzowany użytkownik przesyła żądanie cofnięcia polubienia.
- **Cel:**
  - Sprawdzić, czy użytkownik zostaje usunięty z listy `likes` w poście.
  - Zweryfikować, że kontroler zwraca status HTTP `200`.
- **Dlaczego:** Sprawdza, czy funkcjonalność cofania polubień działa prawidłowo.

---

### Zastosowane Techniki
- **Mockowanie modeli `Post` i `User`:** Symulacja interakcji z bazą danych.
- **Obsługa tokenów JWT:** Walidacja autoryzacji użytkownika poprzez testowanie nagłówków żądań.

---

## Dokumentacja API

Dokumentacja API znajduje się pod następującym adresem:

[http://localhost:5000/api-docs/](http://localhost:5000/api-docs/)

---

### Przypadki testowe dla testera manualnego
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


# Technologie Użyte w Projekcie

## **Stos MERN**

Projekt został zbudowany z wykorzystaniem stosu MERN (MongoDB, Express.js, React.js, Node.js), który umożliwia budowę skalowalnych i dynamicznych aplikacji webowych. 

- **MongoDB:** NoSQL baza danych używana do przechowywania danych aplikacji, takich jak użytkownicy, posty czy komentarze. Dzięki swojej elastyczności umożliwia szybkie modyfikacje schematów danych.  
- **Express.js:** Backendowy framework dla Node.js, który zapewnia prostą obsługę routingu, middleware i logiki aplikacji.  
- **React.js:** Biblioteka frontendowa używana do budowy dynamicznego i interaktywnego interfejsu użytkownika. React pozwala na efektywne zarządzanie stanem aplikacji oraz dynamiczne renderowanie komponentów.  
- **Node.js:** Środowisko uruchomieniowe JavaScript po stronie serwera. Node.js pozwala na wydajną obsługę żądań dzięki asynchronicznej architekturze.

Stos MERN zapewnia spójność technologii, ponieważ wszystkie warstwy aplikacji korzystają z JavaScript.

---

## **Dodatkowe Biblioteki i Narzędzia**

### **bcrypt**
- **Opis:** Biblioteka do haszowania haseł.
- **Zastosowanie w projekcie:**
  - Szyfrowanie haseł użytkowników przed zapisaniem w bazie danych.
  - Sprawdzanie poprawności haseł podczas logowania.

---

### **cloudinary**
- **Opis:** Narzędzie do przesyłania i zarządzania obrazami.
- **Zastosowanie w projekcie:**
  - Przesyłanie i przechowywanie obrazów dodawanych przez użytkowników.
  - Generowanie linków URL do obrazów, które są następnie osadzane w postach.

---

### **cookie-parser**
- **Opis:** Middleware do obsługi plików cookie w Express.js.
- **Zastosowanie w projekcie:**
  - Parsowanie tokenów JWT przechowywanych w plikach cookie w celu autoryzacji użytkowników.

---

### **cors**
- **Opis:** Middleware do obsługi żądań między domenami (CORS).
- **Zastosowanie w projekcie:**
  - Pozwala aplikacji frontendowej komunikować się z API backendowym.

---

### **dotenv**
- **Opis:** Narzędzie do zarządzania zmiennymi środowiskowymi.
- **Zastosowanie w projekcie:**
  - Przechowywanie poufnych informacji, takich jak klucze API czy dane do połączenia z bazą danych.

---

### **express**
- **Opis:** Framework do budowy aplikacji webowych i API w Node.js.
- **Zastosowanie w projekcie:**
  - Obsługa żądań HTTP, middleware i routingu.

---

### **jsonwebtoken**
- **Opis:** Biblioteka do generowania i weryfikacji tokenów JWT.
- **Zastosowanie w projekcie:**
  - Generowanie tokenów uwierzytelniających dla zalogowanych użytkowników.
  - Weryfikacja dostępu do chronionych zasobów.

---

### **mongoose**
- **Opis:** Narzędzie ODM (Object Document Mapping) dla MongoDB.
- **Zastosowanie w projekcie:**
  - Tworzenie modeli danych i zarządzanie bazą MongoDB.
  - Walidacja i manipulacja danymi.

---

### **node-cron**
- **Opis:** Biblioteka do planowania zadań w Node.js.
- **Zastosowanie w projekcie:**
  - Usuwanie niezweryfikowanych kont użytkowników.

---

### **nodemailer**
- **Opis:** Biblioteka do wysyłania e-maili z aplikacji Node.js.
- **Zastosowanie w projekcie:**
  - Wysyłanie wiadomości e-mail weryfikacyjnych podczas rejestracji użytkowników.
  - Powiadamianie o aktywnościach w aplikacji.

