# Testovanie ExtensionPay pre ClipSmart

Tento dokument vysvetľuje, ako testovať ExtensionPay integráciu v ClipSmart.

## 1. Spustenie testov

### 1.1 V prehliadači
```javascript
// Otvorte console v popup
// Načítajte test súbor
const script = document.createElement('script');
script.src = '../tests/extensionpay-test.js';
document.head.appendChild(script);

// Spustite testy
runExtensionPayTests();
```

### 1.2 V Node.js
```bash
# Inštalácia závislostí
npm install

# Spustenie testov
node tests/extensionpay-test.js
```

## 2. Manuálne testovanie

### 2.1 Testovanie free verzie
1. Nainštalujte extension
2. Otvorte popup
3. Skontrolujte, či sa zobrazuje "Upgrade Pro" button
4. Skúste pridať viac ako 20 položiek
5. Skúste preložiť viac ako 50 textov
6. Skontrolujte, či sa zobrazujú limity

### 2.2 Testovanie premium verzie
1. Kliknite na "Upgrade Pro"
2. Dokončite platbu cez ExtensionPay
3. Skontrolujte, či sa premium funkcie aktivovali
4. Overte, či sa "Upgrade Pro" button skryl
5. Testujte neobmedzené funkcie

### 2.3 Testovanie trial
1. Kliknite na trial link (ak je dostupný)
2. Dokončite trial registráciu
3. Overte, či sa trial aktivoval
4. Skontrolujte trial obmedzenia

## 3. Testovacie scenáre

### 3.1 Scenár 1: Nový používateľ
```javascript
// Test: Nový používateľ by mal mať free účet
const user = await extpay.getUser();
console.assert(user.paid === false, 'New user should be free');
console.assert(user.paidAt === null, 'New user should not have paid date');
```

### 3.2 Scenár 2: Platba
```javascript
// Test: Po platbe by mal byť používateľ premium
await extpay.openPaymentPage();
const user = await extpay.getUser();
console.assert(user.paid === true, 'User should be premium after payment');
console.assert(user.paidAt !== null, 'User should have paid date');
```

### 3.3 Scenár 3: Limity
```javascript
// Test: Free používateľ by mal mať limity
const config = window.EXTPAY_CONFIG;
const freeLimits = config.limits.free;

console.assert(freeLimits.items === 20, 'Free users should have 20 items limit');
console.assert(freeLimits.translationsPerDay === 50, 'Free users should have 50 translations limit');
```

### 3.4 Scenár 4: UI aktualizácie
```javascript
// Test: UI by sa mal aktualizovať podľa premium statusu
const upgradeButton = document.getElementById('upgradeButton');
const user = await extpay.getUser();

if (user.paid) {
    console.assert(upgradeButton.style.display === 'none', 'Upgrade button should be hidden for premium users');
} else {
    console.assert(upgradeButton.style.display === 'block', 'Upgrade button should be visible for free users');
}
```

## 4. Debugovanie

### 4.1 Console logy
```javascript
// Pridajte tieto logy do popup.js
console.log('ExtensionPay initialized:', this.extpay);
console.log('User status:', this.user);
console.log('Premium status:', this.isPro);
console.log('Limits:', {
    items: this.freeItemLimit,
    translations: this.freeTranslationLimit
});
```

### 4.2 Network tab
1. Otvorte Developer Tools
2. Prejdite na Network tab
3. Kliknite na "Upgrade Pro"
4. Skontrolujte ExtensionPay API volania

### 4.3 Storage tab
1. Otvorte Developer Tools
2. Prejdite na Application tab
3. Skontrolujte Extension Storage
4. Hľadajte ExtensionPay kľúče

## 5. Bežné problémy

### 5.1 ExtensionPay sa nenačíta
**Príčina:** Nesprávne načítanie skriptu
**Riešenie:**
```html
<!-- Skontrolujte, či je v popup.html -->
<script src="../extensionpay-config.js"></script>
<script src="../js/extpay.js"></script>
<script src="popup.js"></script>
```

### 5.2 Platby nefungujú
**Príčina:** Nesprávny Extension ID
**Riešenie:**
```javascript
// Skontrolujte extensionpay-config.js
const EXTENSION_ID = 'your-correct-extension-id';
```

### 5.3 UI sa neaktualizuje
**Príčina:** Chýbajúce event listeners
**Riešenie:**
```javascript
// Skontrolujte, či sú nastavené listeners
this.extpay.onPaid.addListener((user) => {
    this.isPro = user.paid;
    this.updateLimits();
    this.updateUIText();
});
```

## 6. Automatizované testy

### 6.1 Spustenie všetkých testov
```bash
# V root priečinku projektu
npm test
```

### 6.2 Spustenie konkrétnych testov
```bash
# Testy pre ExtensionPay
npm run test:extensionpay

# Testy pre UI
npm run test:ui

# Testy pre platby
npm run test:payments
```

## 7. Testovacie dáta

### 7.1 Mock dáta
```javascript
const mockUser = {
    paid: false,
    paidAt: null,
    installedAt: new Date(),
    trialStartedAt: null
};

const mockPlans = [
    {
        nickname: 'monthly',
        price: 2.99,
        currency: 'USD',
        interval: 'month'
    },
    {
        nickname: 'yearly',
        price: 29.99,
        currency: 'USD',
        interval: 'year'
    }
];
```

### 7.2 Testovacie platby
- **Test Card:** 4242 4242 4242 4242
- **Expiry:** Akýkoľvek budúci dátum
- **CVC:** Akékoľvek 3 čísla

## 8. Výsledky testov

### 8.1 Úspešné testy
```
🧪 Running ExtensionPay Tests...

✅ ExtensionPay Initialization
✅ Free User Status
✅ Payment Flow
✅ Trial Flow
✅ Get Plans
✅ Limits Configuration
✅ Feature Checks
✅ UI Updates

📊 Test Results:
✅ Passed: 8
❌ Failed: 0
📈 Total: 8

🎉 All tests passed!
```

### 8.2 Neúspešné testy
```
🧪 Running ExtensionPay Tests...

✅ ExtensionPay Initialization
❌ Payment Flow: Payment callback should be triggered
✅ Trial Flow
❌ UI Updates: Upgrade button should be hidden for premium users

📊 Test Results:
✅ Passed: 2
❌ Failed: 2
📈 Total: 4

⚠️  Some tests failed. Please check the implementation.
```

## 9. Kontakt

Pre podporu s testovaním:
- Vytvorte issue na GitHub
- Opíšte problém s detailmi
- Pridajte console logy a screenshots 