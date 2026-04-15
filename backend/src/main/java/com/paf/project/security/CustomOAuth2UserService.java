package com.paf.project.security;

import java.time.LocalDateTime;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.paf.project.model.auth.User;
import com.paf.project.repository.auth.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    /**
     * Spring calls this after Google/GitHub returns the user's profile.
     * Different providers have different attributes:
     *  Google:  sub (unique ID), email, name, picture
     *  GitHub:  id (unique ID), login, email, name
     *
     * Our job here:
     *  1. Detect which provider (Google or GitHub) based on attributes
     *  2. Extract provider-specific attributes
     *  3. Check if this OAuth user already exists in our DB
     *  4. If yes → update their name if it changed
     *  5. If no  → create a new User with role=STUDENT (default)
     *  6. Return the original OAuth2User — Spring Security still needs it
     */
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        // 1. Let Spring fetch the user profile from the provider
        OAuth2User oAuth2User = super.loadUser(userRequest);

        // 2. Detect provider and extract attributes accordingly
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        
        final String oauthProviderId;
        final String email;
        final String fullName;

        if ("google".equals(registrationId)) {
            // Google attributes
            oauthProviderId = oAuth2User.getAttribute("sub");
            email = oAuth2User.getAttribute("email");
            fullName = oAuth2User.getAttribute("name");
            
            if (oauthProviderId == null || email == null || fullName == null) {
                throw new OAuth2AuthenticationException("Missing required Google OAuth attributes");
            }
        } else if ("github".equals(registrationId)) {
            // GitHub attributes
            Object gitHubId = oAuth2User.getAttribute("id");
            if (gitHubId == null) {
                throw new OAuth2AuthenticationException("Missing required GitHub ID attribute");
            }
            
            oauthProviderId = gitHubId.toString();
            Object gitHubEmail = oAuth2User.getAttribute("email");
            Object gitHubLogin = oAuth2User.getAttribute("login");
            
            email = gitHubEmail != null 
                ? gitHubEmail.toString()
                : (gitHubLogin != null ? gitHubLogin + "@github.com" : null);
            
            Object gitHubName = oAuth2User.getAttribute("name");
            fullName = gitHubName != null 
                ? gitHubName.toString() 
                : (gitHubLogin != null ? gitHubLogin.toString() : null);
            
            if (email == null || fullName == null) {
                throw new OAuth2AuthenticationException("Unable to extract email or name from GitHub profile");
            }
        } else {
            throw new OAuth2AuthenticationException("Unsupported OAuth provider: " + registrationId);
        }

        // 3. Find existing user OR create new one — "find-or-create" pattern
        userRepository.findByOauthProviderId(oauthProviderId)
                .ifPresentOrElse(
                    existingUser -> {
                        // Update name in case user changed it
                        existingUser.setFullName(fullName);
                        userRepository.save(existingUser);
                    },
                    () -> {
                        // First-time login — provision a new User record
                        User newUser = new User();
                        newUser.setEmail(email);
                        newUser.setFullName(fullName);
                        newUser.setOauthProviderId(oauthProviderId);
                        newUser.setRole(User.Role.STUDENT);
                        newUser.setCreatedAt(LocalDateTime.now());
                        userRepository.save(newUser);
                    }
                );

        return oAuth2User; // pass through — SuccessHandler reads the DB user next
    }
}
