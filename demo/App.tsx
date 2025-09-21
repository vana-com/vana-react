import React from "react";
import { VanaAppSocialShareWidget } from "../src/components/VanaAppSocialShareWidget";
import "./styles.css";

const App: React.FC = () => {
  const handleShare = (platform: string) => {
    console.log(`Shared on ${platform}`);
  };

  const handleCopySuccess = (platform: string, shareText: string, delayMs: number) => {
    console.log(`Copy success! Platform: ${platform}, Delay: ${delayMs}ms`);
    console.log(`Share text: ${shareText}`);
    // Example: Send analytics event
    // analytics.track('share_copied', { platform, text_length: shareText.length });
  };


  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 overflow-x-hidden">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-gray-900">
          🚀 VanaAppSocialShareWidget Demo
        </h1>

        {/* Real App Examples */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">Real App Designs</h2>
          <p className="text-gray-600 mb-6">Recreating actual designs from Vana apps:</p>

          <div className="space-y-8 md:grid md:grid-cols-2 md:gap-8 md:space-y-0">
            {/* Oracle Reading (Dark/Neon Green) */}
            <div className="bg-black rounded-lg overflow-hidden">
              <div className="p-8">
                <VanaAppSocialShareWidget
                  appName="Oracle Reading"
                  shareContent="Your personalized oracle reading"
                  shareEmoji="🔮"
                  title="SHARE YOUR ORACLE READING"
                  onShare={handleShare}
                  classNames={{
                    root: "text-center",
                    title:
                      "flex items-center justify-center gap-2 mb-8 text-sm text-[#00ff00] font-mono uppercase tracking-wider",
                    buttons: "flex items-center justify-center gap-3 md:gap-4",
                    button:
                      "w-10 h-10 md:w-14 md:h-14 rounded-full border-2 border-[#00ff00] bg-transparent text-[#00ff00] hover:bg-[#00ff00] hover:text-black transition-all duration-300 flex items-center justify-center cursor-pointer",
                    toast:
                      "fixed bottom-4 right-4 bg-black border border-[#00ff00] text-[#00ff00] rounded-lg p-4 min-w-[280px] max-w-[90vw] z-50",
                    toastContent: "text-sm",
                    progress: "!bg-[#00ff00]/20",
                  }}
                  theme={{ iconSize: 24 }}
                />
              </div>
            </div>

            {/* Retro Score (Pink Background) */}
            <div
              className="rounded-lg overflow-hidden relative"
              style={{
                background: "linear-gradient(135deg, #ff69b4 0%, #ff1493 100%)",
              }}
            >
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 10px,
                    rgba(255,255,255,0.1) 10px,
                    rgba(255,255,255,0.1) 20px
                  )`,
                }}
              />
              <div className="relative p-8 border-4 border-black bg-white/10">
                <VanaAppSocialShareWidget
                  appName="Score Share"
                  shareContent="My amazing score"
                  shareEmoji="📢"
                  title="SHARE UR SCORE:"
                  onShare={handleShare}
                  buttonComponent={({ platform, Icon, onClick }) => (
                    <button
                      onClick={onClick}
                      className="px-5 py-2.5 bg-black text-white font-bold uppercase text-sm tracking-wider hover:bg-gray-800 transition-colors flex items-center gap-2 cursor-pointer"
                      aria-label={`Share on ${platform}`}
                      data-platform={platform}
                    >
                      <Icon size={18} />
                      <span>
                        {platform === "twitter" && "TWEET"}
                        {platform === "facebook" && "FB"}
                        {platform === "linkedin" && "LINKED"}
                        {platform === "instagram" && "INSTA"}
                      </span>
                    </button>
                  )}
                  classNames={{
                    root: "text-center",
                    title:
                      "flex items-center justify-center gap-2 mb-6 text-black font-bold uppercase tracking-wider",
                    buttons: "flex items-center justify-center gap-3 flex-wrap",
                    toast:
                      "fixed bottom-4 right-4 bg-black text-white rounded p-4 min-w-[280px] max-w-[90vw] z-50",
                    toastContent: "text-sm",
                  }}
                  theme={{ iconSize: 20 }}
                />
                <div className="text-center mt-4 text-xs text-black/60 font-mono">
                  copy → paste → slay
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Unstyled Demo */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">Unstyled (Default)</h2>
          <p className="text-gray-600 mb-6">
            The component ships completely unstyled - you have full control:
          </p>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <VanaAppSocialShareWidget
              appName="Test App"
              shareContent="This is completely unstyled by default"
              shareEmoji="✨"
              onShare={handleShare}
            />
          </div>
        </section>

        {/* Styled with Tailwind Classes */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">Styled with Tailwind</h2>
          <p className="text-gray-600 mb-6">
            Apply Tailwind classes to every part of the component:
          </p>

          <div className="space-y-8 md:grid md:grid-cols-2 md:gap-8 md:space-y-0">
            {/* Ice Cream Flavor Demo */}
            <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-2xl shadow-lg overflow-hidden">
              <div className="p-8">
                <h3 className="text-xl font-semibold mb-6 text-gray-800">Ice Cream Flavor</h3>

                <div className="bg-white rounded-xl p-6 mb-8 text-center shadow-sm">
                  <div className="text-5xl mb-4">🍦</div>
                  <div className="text-2xl font-bold text-purple-600 mb-2">ChocoVision Leader</div>
                  <p className="text-gray-600">
                    Dark Chocolate - Apparently I&apos;m in the same league as Beyoncé!
                  </p>
                </div>

                <VanaAppSocialShareWidget
                  appName="Ice Cream Flavor"
                  shareContent="ChocoVision Leader (Dark Chocolate)"
                  shareEmoji="🍦"
                  funnyNote="Apparently I&apos;m in the same league as Beyoncé! 😎"
                  title="Share your flavor"
                  onShare={handleShare}
                  onCopySuccess={handleCopySuccess}
                  classNames={{
                    root: "text-center",
                    title:
                      "flex items-center justify-center gap-1 mb-6 text-sm text-[#5851FF] font-medium",
                    buttons: "flex items-center justify-center gap-3 md:gap-4",
                    button:
                      "w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center cursor-pointer [data-platform='twitter']:text-[#1DA1F2] [data-platform='facebook']:text-[#1877F2] [data-platform='linkedin']:text-[#0A66C2] [data-platform='instagram']:text-[#E4405F]",
                    toast:
                      "fixed bottom-4 right-4 bg-white rounded-lg shadow-xl p-4 min-w-[280px] max-w-[90vw] z-50",
                    toastContent: "font-semibold text-gray-900",
                  }}
                  theme={{ iconSize: 20 }}
                />
              </div>
            </div>

            {/* Coinology Demo */}
            <div className="bg-black rounded-2xl shadow-lg overflow-hidden relative">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 10px,
                    rgba(255,255,255,0.02) 10px,
                    rgba(255,255,255,0.02) 20px
                  )`,
                }}
              ></div>
              <div className="relative p-8">
                <h3 className="text-xl font-semibold mb-6 text-gray-100">What Token Are You</h3>

                <div className="bg-gray-900/50 backdrop-blur rounded-xl p-6 mb-8 text-center">
                  <div className="text-5xl mb-4">🪙</div>
                  <div className="text-2xl font-bold text-white mb-2">
                    The Sovereign Network Diplomat
                  </div>
                  <p className="text-gray-400">ATOM - Sound like me? 💎✋</p>
                </div>

                <VanaAppSocialShareWidget
                  appName="What Token Are You"
                  shareContent="The Sovereign Network Diplomat (ATOM)"
                  shareEmoji="🪙"
                  funnyNote="Sound like me? 💎✋"
                  title="Share your token"
                  onShare={handleShare}
                  classNames={{
                    root: "text-center",
                    title:
                      "flex items-center justify-center gap-1 mb-6 text-sm text-gray-300 font-medium",
                    buttons: "flex items-center justify-center gap-3 md:gap-4",
                    button:
                      "w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/40 border-2 border-gray-600 hover:scale-105 transition-all duration-200 flex items-center justify-center text-white cursor-pointer [data-platform='twitter']:!border-[#1DA1F2]",
                    toast:
                      "fixed bottom-4 right-4 bg-gray-800 rounded-lg shadow-xl p-4 min-w-[280px] max-w-[90vw] z-50 border border-gray-700",
                    toastContent: "text-sm text-gray-400",
                  }}
                  theme={{ iconSize: 20 }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Custom Button Component */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">Custom Button Component</h2>
          <p className="text-gray-600 mb-6">Bring your own button component with Tailwind:</p>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <VanaAppSocialShareWidget
              appName="Custom App"
              shareContent="Using a custom button component"
              shareEmoji="🎨"
              title="Custom Design System Buttons"
              onShare={handleShare}
              buttonComponent={({ Icon, onClick, platform }) => (
                <button
                  onClick={onClick}
                  className="group flex flex-col items-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 hover:from-indigo-50 hover:to-indigo-100 transition-all duration-200"
                  aria-label={`Share on ${platform}`}
                >
                  <Icon size={24} className="text-gray-600 group-hover:text-indigo-600" />
                  <span className="text-xs text-gray-500 group-hover:text-indigo-600 capitalize">
                    {platform}
                  </span>
                </button>
              )}
              classNames={{
                root: "text-center",
                title:
                  "flex items-center justify-center gap-2 mb-8 text-lg text-gray-700 font-medium",
                buttons: "flex items-center justify-center gap-3",
              }}
            />
          </div>
        </section>

        {/* Render Prop */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">Render Prop Pattern</h2>
          <p className="text-gray-600 mb-6">Complete control with render props:</p>

          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-8">
            <VanaAppSocialShareWidget
              appName="Render Prop App"
              shareContent="Maximum flexibility with render props"
              shareEmoji="🚀"
              hideTitle
              onShare={handleShare}
              renderButton={(platform, Icon) => (
                <div className="flex flex-col items-center gap-2 p-4 bg-white/10 backdrop-blur rounded-xl hover:bg-white/20 transition-all duration-200 cursor-pointer group">
                  <Icon size={32} className="text-white" />
                  <span className="text-white/80 text-sm capitalize group-hover:text-white">
                    {platform}
                  </span>
                </div>
              )}
              classNames={{
                buttons: "flex items-center justify-center gap-3 md:gap-4",
              }}
            />
          </div>
        </section>

        {/* Code Example */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">📝 Usage Example</h2>
          <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
            <pre className="text-sm">
              <code className="text-gray-300">{`import { VanaAppSocialShareWidget } from '@opendatalabs/vana-react';

// Unstyled by default - style with Tailwind classes
function MyApp() {
  return (
    <VanaAppSocialShareWidget
      appName="Ice Cream Flavor"
      shareContent="ChocoVision Leader"
      shareEmoji="🍦"
      title="Share your flavor"

      // Apply Tailwind classes to every part
      classNames={{
        root: 'text-center',
        title: 'flex items-center gap-2 mb-6',
        buttons: 'flex gap-3 md:gap-4',
        button: 'w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-md hover:bg-blue-100',
        // Platform-specific styles via CSS:
        // [data-platform="twitter"]:hover { background: #1DA1F2; }
      }}

      // Or use your own component
      buttonComponent={({ Icon, onClick, platform }) => (
        <button
          onClick={onClick}
          className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200"
        >
          <Icon />
        </button>
      )}

      onShare={(platform) => {
        analytics.track('share', { platform });
      }}
    />
  );
}`}</code>
            </pre>
          </div>
        </section>
      </div>
    </div>
  );
};

export default App;
