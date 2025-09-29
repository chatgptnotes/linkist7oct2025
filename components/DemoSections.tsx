'use client';

export function LightSection() {
  return (
    <section 
      data-section-theme="light" 
      className="bg-var text-var border border-var p-6 rounded-xl transition-colors duration-300"
    >
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-var">Light Section</h2>
        <p className="text-muted-var">
          This section always uses light theme variables regardless of global theme.
        </p>
        
        <div className="bg-card text-card border border-var p-4 rounded-lg">
          <h3 className="font-medium text-card mb-2">Card Inside Light Section</h3>
          <p className="text-muted-var text-sm">
            Cards adapt to their section&apos;s theme context.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-lg bg-primary-var text-primary-fg-var hover:opacity-90 transition-opacity">
            Primary Button
          </button>
          <button className="px-4 py-2 rounded-lg border border-var text-var hover:bg-accent-var hover:text-var transition-colors">
            Secondary Button
          </button>
        </div>
      </div>
    </section>
  );
}

export function DarkSection() {
  return (
    <section 
      data-section-theme="dark" 
      className="bg-var text-var border border-var p-6 rounded-xl transition-colors duration-300"
    >
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-var">Dark Section</h2>
        <p className="text-muted-var">
          This section always uses dark theme variables regardless of global theme.
        </p>
        
        <div className="bg-card text-card border border-var p-4 rounded-lg">
          <h3 className="font-medium text-card mb-2">Card Inside Dark Section</h3>
          <p className="text-muted-var text-sm">
            Cards automatically inherit the section&apos;s dark theme.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-lg bg-primary-var text-primary-fg-var hover:opacity-90 transition-opacity">
            Primary Button
          </button>
          <button className="px-4 py-2 rounded-lg border border-var text-var hover:bg-accent-var hover:text-var transition-colors">
            Secondary Button
          </button>
        </div>
      </div>
    </section>
  );
}

export function NeutralSection() {
  return (
    <section className="bg-var text-var border border-var p-6 rounded-xl transition-colors duration-300">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-var">Neutral Section</h2>
        <p className="text-muted-var">
          This section follows the global theme. Toggle the theme to see it change.
        </p>
        
        <div className="bg-card text-card border border-var p-4 rounded-lg">
          <h3 className="font-medium text-card mb-2">Adaptive Card</h3>
          <p className="text-muted-var text-sm">
            This card changes with the global theme toggle.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-lg bg-primary-var text-primary-fg-var hover:opacity-90 transition-opacity">
            Primary Button
          </button>
          <button className="px-4 py-2 rounded-lg border border-var text-var hover:bg-accent-var hover:text-var transition-colors">
            Secondary Button
          </button>
        </div>
      </div>
    </section>
  );
}