            <div className="rounded-2xl bg-slate-50 p-8 shadow-sm ring-1 ring-slate-200 hover:shadow-md transition">
              <div className="flex items-start">
                <div className="mr-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100">
                  <svg
                    className="h-7 w-7 text-orange-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Ticket Management
                  </h3>
                  <p className="mt-3 text-slate-600">
                    Create, track, and resolve maintenance issues with image attachments and priority levels.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="rounded-2xl bg-slate-50 p-8 shadow-sm ring-1 ring-slate-200 hover:shadow-md transition">
              <div className="flex items-start">
                <div className="mr-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-100">
                  <svg
                    className="h-7 w-7 text-purple-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Real-time Notifications
                  </h3>
                  <p className="mt-3 text-slate-600">
                    Stay updated with instant alerts for bookings, ticket updates, and facility changes.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="rounded-2xl bg-slate-50 p-8 shadow-sm ring-1 ring-slate-200 hover:shadow-md transition">
              <div className="flex items-start">
                <div className="mr-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                  <svg
                    className="h-7 w-7 text-red-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Analytics Dashboard
                  </h3>
                  <p className="mt-3 text-slate-600">
                    Track facility utilization, booking trends, and maintenance metrics in real-time.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="rounded-2xl bg-slate-50 p-8 shadow-sm ring-1 ring-slate-200 hover:shadow-md transition">
              <div className="flex items-start">
                <div className="mr-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100">
                  <svg
                    className="h-7 w-7 text-indigo-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    QR Check-in
                  </h3>
                  <p className="mt-3 text-slate-600">
                    Simple QR code-based check-in system for approved bookings and facility access.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================
         Part 3: How It Works
      ====================================== */}
      <section className="relative bg-slate-50" id="how-it-works">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20 lg:py-24">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
              Simple Process
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              How Smart Campus Hub Works
            </h2>
            <div className="mx-auto mt-4 h-1 w-24 rounded bg-blue-600" />
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-4">
            {/* Step 1 */}
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900">Sign In</h3>
              <p className="mt-2 text-slate-600">
                Secure Google OAuth authentication for quick and easy access.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900">Explore</h3>
              <p className="mt-2 text-slate-600">
                Browse available facilities, view details, capacity, and amenities.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900">Book or Report</h3>
              <p className="mt-2 text-slate-600">
                Request bookings or create maintenance tickets as needed.
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
                4
              </div>
              <h3 className="text-lg font-bold text-slate-900">Track</h3>
              <p className="mt-2 text-slate-600">
                Monitor status and get real-time notifications on updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================
         Part 4: Stats Ribbon
      ====================================== */}
      <section className="bg-blue-600">
        <div className="mx-auto max-w-7xl px-6 py-12 sm:py-14 lg:py-16">
          <div className="grid grid-cols-2 gap-y-10 text-center text-white sm:grid-cols-4">
            <div>
              <div className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                500+
              </div>
              <div className="mt-2 text-sm text-blue-100">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                50+
              </div>
              <div className="mt-2 text-sm text-blue-100">Facilities Managed</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                10,000+
              </div>
              <div className="mt-2 text-sm text-blue-100">Bookings Processed</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                99.9%
              </div>
              <div className="mt-2 text-sm text-blue-100">System Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================
         Part 5: Benefits Section
      ====================================== */}
      <section className="relative bg-white" id="benefits"
        style={{
          backgroundImage: "radial-gradient(#e5e7eb 1.2px, transparent 1.2px)",
          backgroundSize: "28px 28px",
        }}
      >
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20 lg:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 ring-1 ring-inset ring-blue-100">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2l2.09 6.26L20 9l-5 3.64L16.18 20 12 16.9 7.82 20 9 12.64 4 9l5.91-.74L12 2z" />
                </svg>
                Campus Benefits
              </span>

              <h2 className="mt-4 text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl md:text-6xl">
                Transform Your <span className="text-blue-600">Campus Operations</span>
              </h2>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                Streamline facility management, reduce booking conflicts, accelerate maintenance resolution, and improve campus user satisfaction with our intelligent platform.
              </p>

              <div className="mt-10 space-y-4">
                <div className="flex items-start">
                  <svg
                    className="h-6 w-6 flex-shrink-0 text-green-600"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                  <span className="ml-3 text-lg text-slate-700">
                    Reduce facility booking conflicts by 95%
                  </span>
                </div>
                <div className="flex items-start">
                  <svg
                    className="h-6 w-6 flex-shrink-0 text-green-600"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                  <span className="ml-3 text-lg text-slate-700">
                    Improve maintenance response time by 40%
                  </span>
                </div>
                <div className="flex items-start">
                  <svg
                    className="h-6 w-6 flex-shrink-0 text-green-600"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                  <span className="ml-3 text-lg text-slate-700">
                    Increase facility utilization visibility
                  </span>
                </div>
                <div className="flex items-start">
                  <svg
                    className="h-6 w-6 flex-shrink-0 text-green-600"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                  <span className="ml-3 text-lg text-slate-700">
                    Enhance user experience with 24/7 access
                  </span>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                {!isAuthenticated ? (
                  <button
                    onClick={() => navigate("/login")}
                    className="inline-flex items-center rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                  >
                    Start Free Trial
                    <svg
                      className="ml-2 h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 12h14" />
                      <path d="M12 5l7 7-7 7" />
                    </svg>
                  </button>
                ) : (
                  <Link
                    to="/facilities"
                    className="inline-flex items-center rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                  >
                    Explore Facilities
                    <svg
                      className="ml-2 h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 12h14" />
                      <path d="M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-slate-50 p-8 shadow-xl ring-1 ring-slate-200">
                <div className="space-y-6">
                  <div className="rounded-lg bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-slate-500">Booking Success Rate</div>
                        <div className="mt-1 text-2xl font-bold text-slate-900">98%</div>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-xl">
                        ✓
                      </div>
                    </div>
                    <div className="mt-4 h-2 w-full rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-green-500"
                        style={{ width: "98%" }}
                      ></div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-slate-500">Issue Resolution</div>
                        <div className="mt-1 text-2xl font-bold text-slate-900">24 hrs</div>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-xl">
                        ⚡
                      </div>
                    </div>
                    <div className="mt-4 text-xs text-slate-500">
                      Average response time
                    </div>
                  </div>

                  <div className="rounded-lg bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-slate-500">User Satisfaction</div>
                        <div className="mt-1 text-2xl font-bold text-slate-900">4.8/5</div>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center text-xl">
                        ⭐
                      </div>
                    </div>
                    <div className="mt-4 flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${
                            i < 4 ? "text-yellow-400" : "text-slate-300"
                          }`}
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 2l2.09 6.26L20 9l-5 3.64L16.18 20 12 16.9 7.82 20 9 12.64 4 9l5.91-.74L12 2z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================
         Part 6: CTA Section
      ====================================== */}
      <section className="bg-linear-to-r from-blue-600 to-blue-800">
        <div className="mx-auto max-w-4xl px-6 py-16 sm:py-20 lg:py-24 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl md:text-5xl">
            Ready to Optimize Your Campus Operations?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100">
            Join hundreds of universities already using Smart Campus Hub to streamline their facility management, bookings, and maintenance operations.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="inline-flex items-center rounded-xl bg-white px-8 py-3 text-base font-semibold text-blue-600 shadow-sm transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
                >
                  Get Started Now
                  <svg
                    className="ml-2 h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14" />
                    <path d="M12 5l7 7-7 7" />
                  </svg>
                </button>

                <a
                  href="#features"
                  className="inline-flex items-center rounded-xl border-2 border-white px-8 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
                >
                  Learn More
                </a>
              </>
            ) : (
              <>
                <Link
                  to="/user/dashboard"
                  className="inline-flex items-center rounded-xl bg-white px-8 py-3 text-base font-semibold text-blue-600 shadow-sm transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
                >
                  Go to Dashboard
                  <svg
                    className="ml-2 h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14" />
                    <path d="M12 5l7 7-7 7" />
                  </svg>
                </Link>

                <Link
                  to="/facilities"
                  className="inline-flex items-center rounded-xl border-2 border-white px-8 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
                >
                  Browse Facilities
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
