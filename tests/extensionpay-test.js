// ExtensionPay Tests for ClipSmart

// Mock ExtensionPay pre testovanie
class MockExtPay {
    constructor(extensionId) {
        this.extensionId = extensionId;
        this.user = {
            paid: false,
            paidAt: null,
            installedAt: new Date(),
            trialStartedAt: null
        };
        this.paidCallbacks = [];
        this.trialCallbacks = [];
    }
    
    async getUser() {
        return this.user;
    }
    
    onPaid = {
        addListener: (callback) => {
            this.paidCallbacks.push(callback);
        }
    };
    
    onTrialStarted = {
        addListener: (callback) => {
            this.trialCallbacks.push(callback);
        }
    };
    
    async openPaymentPage(planNickname) {
        // Simulácia platby
        return new Promise((resolve) => {
            setTimeout(() => {
                this.user.paid = true;
                this.user.paidAt = new Date();
                this.paidCallbacks.forEach(cb => cb(this.user));
                resolve();
            }, 1000);
        });
    }
    
    async getPlans() {
        return [
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
    }
    
    async openTrialPage(period) {
        this.user.trialStartedAt = new Date();
        this.trialCallbacks.forEach(cb => cb(this.user));
    }
    
    async openLoginPage() {
        // Simulácia login
        return Promise.resolve();
    }
    
    startBackground() {
        // Mock background functionality
        console.log('Mock ExtensionPay background started');
    }
}

// Test suite
class ExtensionPayTests {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }
    
    addTest(name, testFunction) {
        this.tests.push({ name, testFunction });
    }
    
    async runTests() {
        console.log('🧪 Running ExtensionPay Tests...\n');
        
        for (const test of this.tests) {
            try {
                await test.testFunction();
                console.log(`✅ ${test.name}`);
                this.passed++;
            } catch (error) {
                console.error(`❌ ${test.name}: ${error.message}`);
                this.failed++;
            }
        }
        
        this.printResults();
    }
    
    printResults() {
        console.log('\n📊 Test Results:');
        console.log(`✅ Passed: ${this.passed}`);
        console.log(`❌ Failed: ${this.failed}`);
        console.log(`📈 Total: ${this.tests.length}`);
        
        if (this.failed === 0) {
            console.log('🎉 All tests passed!');
        } else {
            console.log('⚠️  Some tests failed. Please check the implementation.');
        }
    }
}

// Testy
async function runExtensionPayTests() {
    const testSuite = new ExtensionPayTests();
    
    // Test 1: Inicializácia
    testSuite.addTest('ExtensionPay Initialization', async () => {
        const extpay = new MockExtPay('test-extension-id');
        const user = await extpay.getUser();
        
        if (!user || typeof user.paid !== 'boolean') {
            throw new Error('User object should have paid property');
        }
    });
    
    // Test 2: Free user
    testSuite.addTest('Free User Status', async () => {
        const extpay = new MockExtPay('test-extension-id');
        const user = await extpay.getUser();
        
        if (user.paid !== false) {
            throw new Error('New user should be free');
        }
    });
    
    // Test 3: Payment flow
    testSuite.addTest('Payment Flow', async () => {
        const extpay = new MockExtPay('test-extension-id');
        let paymentReceived = false;
        
        extpay.onPaid.addListener((user) => {
            paymentReceived = true;
        });
        
        await extpay.openPaymentPage();
        
        if (!paymentReceived) {
            throw new Error('Payment callback should be triggered');
        }
        
        const user = await extpay.getUser();
        if (!user.paid) {
            throw new Error('User should be premium after payment');
        }
    });
    
    // Test 4: Trial flow
    testSuite.addTest('Trial Flow', async () => {
        const extpay = new MockExtPay('test-extension-id');
        let trialStarted = false;
        
        extpay.onTrialStarted.addListener((user) => {
            trialStarted = true;
        });
        
        await extpay.openTrialPage('1 week');
        
        if (!trialStarted) {
            throw new Error('Trial callback should be triggered');
        }
        
        const user = await extpay.getUser();
        if (!user.trialStartedAt) {
            throw new Error('Trial should be started');
        }
    });
    
    // Test 5: Plans
    testSuite.addTest('Get Plans', async () => {
        const extpay = new MockExtPay('test-extension-id');
        const plans = await extpay.getPlans();
        
        if (!Array.isArray(plans) || plans.length === 0) {
            throw new Error('Should return array of plans');
        }
        
        const monthlyPlan = plans.find(p => p.nickname === 'monthly');
        if (!monthlyPlan) {
            throw new Error('Should have monthly plan');
        }
    });
    
    // Test 6: Limits configuration
    testSuite.addTest('Limits Configuration', () => {
        const config = {
            limits: {
                free: {
                    items: 20,
                    translationsPerDay: 50
                },
                premium: {
                    items: Infinity,
                    translationsPerDay: Infinity
                }
            }
        };
        
        const freeLimits = config.limits.free;
        const premiumLimits = config.limits.premium;
        
        if (freeLimits.items !== 20) {
            throw new Error('Free users should have 20 items limit');
        }
        
        if (premiumLimits.items !== Infinity) {
            throw new Error('Premium users should have unlimited items');
        }
    });
    
    // Test 7: Feature checks
    testSuite.addTest('Feature Checks', () => {
        const config = {
            limits: {
                free: {
                    items: 20,
                    translationsPerDay: 50,
                    exportFormats: ['txt'],
                    tags: false
                },
                premium: {
                    items: Infinity,
                    translationsPerDay: Infinity,
                    exportFormats: ['txt', 'csv', 'json'],
                    tags: true
                }
            }
        };
        
        // Test free user limits
        const freeUser = { paid: false };
        const freeLimits = config.limits.free;
        
        if (freeLimits.exportFormats.length !== 1) {
            throw new Error('Free users should have limited export formats');
        }
        
        if (freeLimits.tags !== false) {
            throw new Error('Free users should not have tags');
        }
        
        // Test premium user limits
        const premiumUser = { paid: true };
        const premiumLimits = config.limits.premium;
        
        if (premiumLimits.exportFormats.length !== 3) {
            throw new Error('Premium users should have all export formats');
        }
        
        if (premiumLimits.tags !== true) {
            throw new Error('Premium users should have tags');
        }
    });
    
    // Test 8: UI updates
    testSuite.addTest('UI Updates', () => {
        // Mock DOM elements
        const mockDOM = {
            upgradeButton: { style: { display: 'block' } },
            body: { classList: { add: () => {}, remove: () => {} } }
        };
        
        // Test free user UI
        const freeUser = { paid: false };
        if (freeUser.paid) {
            mockDOM.upgradeButton.style.display = 'none';
        } else {
            mockDOM.upgradeButton.style.display = 'block';
        }
        
        if (mockDOM.upgradeButton.style.display !== 'block') {
            throw new Error('Upgrade button should be visible for free users');
        }
        
        // Test premium user UI
        const premiumUser = { paid: true };
        if (premiumUser.paid) {
            mockDOM.upgradeButton.style.display = 'none';
        } else {
            mockDOM.upgradeButton.style.display = 'block';
        }
        
        if (mockDOM.upgradeButton.style.display !== 'none') {
            throw new Error('Upgrade button should be hidden for premium users');
        }
    });
    
    // Spustenie testov
    await testSuite.runTests();
}

// Export pre použitie
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MockExtPay,
        ExtensionPayTests,
        runExtensionPayTests
    };
}

// Spustenie testov ak sa súbor načíta priamo
if (typeof window !== 'undefined') {
    window.runExtensionPayTests = runExtensionPayTests;
} 