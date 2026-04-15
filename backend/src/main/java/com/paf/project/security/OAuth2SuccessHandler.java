package com.paf.project.security;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.paf.project.model.auth.User;
import com.paf.project.repository.auth.UserRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    /**
     * Spring calls this method exactly once — right after Google OAuth succeeds
     * AND CustomOAuth2UserService has finished saving/updating the user.
     *
     * What happens here:
     *  1. Extract Google's sub (oauthProviderId) from the OAuth2User
     *  2. Load OUR User record from DB (has the role we control)
     *  3. Generate a JWT with email + role + userId
     *  4. Redirect to frontend with token as a query param
     *     (frontend stores it, strips it from URL, then uses it on all requests)
     *
     * WHY redirect with ?token= instead of a JSON response?
     *  OAuth2 is browser-based — the browser follows Google's redirect back to us.
     *  We can't send a JSON body in a redirect. Query param is the standard pattern.
     *  Frontend MUST immediately store it (localStorage) and replace the URL state.
     */
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        // 1. Get the authenticated OAuth2 principal
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        
        // 2. Extract provider ID — different providers use different attribute names
        //    Google uses "sub", GitHub uses "id"
        String oauthProviderId = oAuth2User.getAttribute("sub");
        if (oauthProviderId == null) {
            // GitHub case: use "id" instead of "sub"
            Object id = oAuth2User.getAttribute("id");
            oauthProviderId = id != null ? id.toString() : null;
        }

        if (oauthProviderId == null) {
            throw new IllegalStateException(
                "Could not extract OAuth provider ID from user attributes"
            );
        }

        // 3. Load OUR user from DB — we need OUR role, not anything from the provider
        User user = userRepository.findByOauthProviderId(oauthProviderId)
                .orElseThrow(() -> new IllegalStateException(
                    "User not found after OAuth — CustomOAuth2UserService should have created them"
                ));

        // 4. Issue our JWT
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole(), user.getId());

        // 5. Redirect to React app — frontend reads ?token= on mount
        String redirectUrl = "http://localhost:5173/auth/callback?token=" + token;
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
