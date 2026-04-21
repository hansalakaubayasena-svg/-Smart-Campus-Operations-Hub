package com.paf.project.dto.auth;

public class DeleteAccountRequest {
    private String password;

    public DeleteAccountRequest() {}

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
