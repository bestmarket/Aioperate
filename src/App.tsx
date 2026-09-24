import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { ThemeProvider, useTheme } from './context/ThemeContext.tsx';
import { Header } from './components/layout/Header.tsx';
import { Sidebar } from './components/layout/Sidebar.tsx';
import { CommandMenu } from './components/layout/CommandMenu.tsx';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard.tsx';
import { LiveChatWidgetModal } from './components/widget/LiveChatWidgetModal.tsx';
import { LandingPage } from './components/landing/LandingPage.tsx';
import { LoginPage } from './components/auth/LoginPage.tsx';
import { TopEnvironmentBar, AppEnvironment } from './components/layout/TopEnvironmentBar.tsx';

// Domain views
import { OverviewView } from './components/dashboard/OverviewView.tsx';
import { AgentBuilderView } from './components/agent/AgentBuilderView.tsx';
import { UnifiedInboxView } from './components/inbox/UnifiedInboxView.tsx';
import { WebsiteChatView } from './components/widget/WebsiteChatView.tsx';
import { WhatsAppView } from './components/whatsapp/WhatsAppView.tsx';
import { LeadsView } from './components/leads/LeadsView.tsx';
import { CrmView } from './components/crm/CrmView.tsx';
import { ProductsView } from './components/products/ProductsView.tsx';
import { OrdersView } from './components/orders/OrdersView.tsx';
import { PaymentsView } from './components/payments/PaymentsView.tsx';
import { BookingsView } from './components/bookings/BookingsView.tsx';
import { AutomationEngineView } from './components/automations/AutomationEngineView.tsx';
import { KnowledgeBaseView } from './components/knowledge/KnowledgeBaseView.tsx';
import { AnalyticsView } from './components/analytics/AnalyticsView.tsx';
import { CampaignsView } from './components/campaigns/CampaignsView.tsx';
import { ShippingLabelsView } from './components/shipping/ShippingLabelsView.tsx';
import { VoiceReceptionistView } from './components/voice/VoiceReceptionistView.tsx';
import { TeamView } from './components/team/TeamView.tsx';
import { IntegrationsView } from './components/integrations/IntegrationsView.tsx';
import { BillingView } from './components/billing/BillingView.tsx';
import { SettingsView } from './components/settings/SettingsView.tsx';

// Additional SaaS upgraded views
import { AiTeamView } from './components/team/AiTeamView.tsx';
import { MarketingStudioView } from './components/marketing/MarketingStudioView.tsx';
import { BusinessStrategyView } from './components/strategy/BusinessStrategyView.tsx';
import { AiWebsiteBuilderView } from './components/website/AiWebsiteBuilderView.tsx';
import { CreativeStudioView } from './components/creative/CreativeStudioView.tsx';
import { ReputationView } from './components/reputation/ReputationView.tsx';
import { DocumentGeneratorView } from './components/documents/DocumentGeneratorView.tsx';
import { AdminPortalView } from './components/admin/AdminPortalView.tsx';
import { AdminSecurityGate } from './components/admin/AdminSecurityGate.tsx';

function MainApp() {
  // Determine initial root mode from URL hash or default to 'landing'
  const getInitialEnv = (): AppEnvironment => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'admin') return 'admin';
      if (hash === 'login' || hash === 'signin' || hash === 'signup') return 'login';
      if (hash === 'dashboard' || hash === 'app') return 'dashboard';
      if (hash === 'landing') return 'landing';
    }
    return 'landing'; // Default to Public Landing Page so visitors always see what the product is
  };

  const [currentEnv, setCurrentEnv] = useState<AppEnvironment>(getInitialEnv);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return typeof window !== 'undefined' && !!sessionStorage.getItem('operateai_admin_token');
  });
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  // Sync state to URL hash
  const changeEnvironment = (env: AppEnvironment) => {
    setCurrentEnv(env);
    if (typeof window !== 'undefined') {
      window.location.hash = env;
    }
  };

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'admin') setCurrentEnv('admin');
      else if (hash === 'login' || hash === 'signin') setCurrentEnv('login');
      else if (hash === 'dashboard' || hash === 'app') setCurrentEnv('dashboard');
      else if (hash === 'landing') setCurrentEnv('landing');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderDashboardContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <OverviewView
            onNavigate={(tab: string) => setActiveTab(tab)}
            onOpenTest={() => setTestModalOpen(true)}
          />
        );
      case 'team_ai':
        return <AiTeamView onOpenTestSandbox={() => setTestModalOpen(true)} />;
      case 'marketing':
        return <MarketingStudioView />;
      case 'strategy':
        return <BusinessStrategyView />;
      case 'website_builder':
        return <AiWebsiteBuilderView />;
      case 'creative':
        return <CreativeStudioView />;
      case 'reputation':
        return <ReputationView />;
      case 'documents':
        return <DocumentGeneratorView />;
      case 'admin':
        return (
          <AdminPortalView
            onNavigateToDashboard={() => {
              changeEnvironment('dashboard');
              setActiveTab('dashboard');
            }}
            onNavigateToLanding={() => changeEnvironment('landing')}
          />
        );
      case 'agent':
        return <AgentBuilderView onOpenTestSandbox={() => setTestModalOpen(true)} />;
      case 'inbox':
        return <UnifiedInboxView />;
      case 'widget':
        return <WebsiteChatView onOpenTestModal={() => setTestModalOpen(true)} />;
      case 'whatsapp':
        return <WhatsAppView />;
      case 'leads':
        return <LeadsView />;
      case 'crm':
        return <CrmView />;
      case 'products':
        return <ProductsView />;
      case 'orders':
        return <OrdersView onNavigateToShipping={() => setActiveTab('shipping')} />;
      case 'payments':
        return <PaymentsView />;
      case 'bookings':
        return <BookingsView />;
      case 'automations':
        return <AutomationEngineView />;
      case 'knowledge':
        return <KnowledgeBaseView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'campaigns':
        return <CampaignsView />;
      case 'shipping':
        return <ShippingLabelsView />;
      case 'voice':
        return <VoiceReceptionistView />;
      case 'team':
        return <TeamView />;
      case 'integrations':
        return <IntegrationsView />;
      case 'billing':
        return <BillingView />;
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <OverviewView
            onNavigate={(tab: string) => setActiveTab(tab)}
            onOpenTest={() => setTestModalOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-slate-800 dark:bg-slate-950 dark:text-slate-100 flex flex-col antialiased transition-colors duration-200">
      {/* Persistent Top Navigator Bar allowing 1-click toggling between all 4 zones */}
      <TopEnvironmentBar
        currentEnv={currentEnv}
        onChangeEnv={changeEnvironment}
        onOpenLiveTest={() => setTestModalOpen(true)}
      />

      {/* ZONE 1: PUBLIC MARKETING LANDING PAGE */}
      {currentEnv === 'landing' && (
        <LandingPage
          onGetStarted={() => {
            changeEnvironment('login');
          }}
          onOpenDemo={() => setTestModalOpen(true)}
          onEnterDashboard={() => {
            changeEnvironment('dashboard');
            setActiveTab('dashboard');
          }}
          onGoToLogin={() => changeEnvironment('login')}
          onGoToAdmin={() => changeEnvironment('admin')}
        />
      )}

      {/* ZONE 2: VISITOR REGISTRATION & CLIENT LOGIN PORTAL (SEPARATED FROM ADMIN) */}
      {currentEnv === 'login' && (
        <LoginPage
          onLoginSuccess={() => {
            changeEnvironment('dashboard');
            setActiveTab('dashboard');
          }}
          onGoToLanding={() => changeEnvironment('landing')}
        />
      )}

      {/* ZONE 3: ISOLATED PLATFORM SUPERADMIN CONTROL PLANE */}
      {currentEnv === 'admin' && (
        !isAdminAuthenticated ? (
          <AdminSecurityGate
            onAuthenticated={() => setIsAdminAuthenticated(true)}
            onGoToDashboard={() => {
              changeEnvironment('dashboard');
              setActiveTab('dashboard');
            }}
            onGoToLanding={() => changeEnvironment('landing')}
          />
        ) : (
          <div className="flex-1 bg-slate-950 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              <AdminPortalView
                onNavigateToDashboard={() => {
                  changeEnvironment('dashboard');
                  setActiveTab('dashboard');
                }}
                onNavigateToLanding={() => changeEnvironment('landing')}
              />
            </div>
          </div>
        )
      )}

      {/* ZONE 4: CLIENT BUSINESS OPERATING SYSTEM (AURA ATELIER) */}
      {currentEnv === 'dashboard' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Header */}
          <Header
            onOpenCommand={() => setCommandOpen(true)}
            onOpenLiveTest={() => setTestModalOpen(true)}
            activeNav={activeTab}
            setActiveNav={(nav: string) => {
              if (nav === 'landing') {
                changeEnvironment('landing');
              } else if (nav === 'admin') {
                changeEnvironment('admin');
              } else if (nav === 'login') {
                changeEnvironment('login');
              } else {
                setActiveTab(nav);
              }
            }}
            onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          />

          {/* Main Workspace with Sidebar & Dynamic View */}
          <div className="flex-1 flex overflow-hidden">
            <Sidebar
              activeNav={activeTab}
              setActiveNav={(nav: string) => {
                if (nav === 'admin') {
                  changeEnvironment('admin');
                } else {
                  setActiveTab(nav);
                  setMobileMenuOpen(false);
                }
              }}
              mobileOpen={mobileMenuOpen}
              setMobileOpen={setMobileMenuOpen}
            />

            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#FAF9F5] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
              <div className="max-w-7xl mx-auto">{renderDashboardContent()}</div>
            </main>
          </div>
        </div>
      )}

      {/* Global Interactive Modals accessible from any screen */}
      <CommandMenu
        isOpen={commandOpen}
        onClose={() => setCommandOpen(false)}
        onSelectNav={(nav: string) => {
          if (nav === 'admin') {
            changeEnvironment('admin');
          } else if (nav === 'landing') {
            changeEnvironment('landing');
          } else {
            changeEnvironment('dashboard');
            setActiveTab(nav);
          }
        }}
        onOpenTest={() => setTestModalOpen(true)}
      />

      <OnboardingWizard
        isOpen={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
        onComplete={() => {
          changeEnvironment('dashboard');
          setActiveTab('dashboard');
        }}
      />

      <LiveChatWidgetModal
        isOpen={testModalOpen}
        onClose={() => setTestModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
