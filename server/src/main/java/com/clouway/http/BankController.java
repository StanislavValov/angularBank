package com.clouway.http;

import com.clouway.core.*;
import com.google.inject.Inject;
import com.google.inject.Provider;
import com.google.inject.Singleton;
import com.google.sitebricks.At;
import com.google.sitebricks.Show;
import com.google.sitebricks.client.transport.Json;
import com.google.sitebricks.headless.Reply;
import com.google.sitebricks.headless.Request;
import com.google.sitebricks.headless.Service;
import com.google.sitebricks.http.Get;
import com.google.sitebricks.http.Post;
import com.google.sitebricks.http.Put;

/**
 * Created by Stanislav Valov <hisazzul@gmail.com>
 */
@At("/bankController")
@Service
@Singleton
public class BankController {

    private com.clouway.core.BankService bankService;
    private BankValidator validator;
    private Provider<Session> currentSessionProvider;
    private SiteMap siteMap;

    @Inject
    public BankController(com.clouway.core.BankService bankService, BankValidator validator, Provider<Session> currentSessionProvider, SiteMap siteMap) {
        this.bankService = bankService;
        this.validator = validator;
        this.currentSessionProvider = currentSessionProvider;
        this.siteMap = siteMap;
    }

    @At("/d/money")
    @Post
    public Reply<?> deposit(Request request) {

        Account account = request.read(Account.class).as(Json.class);
        Session currentSession = currentSessionProvider.get();

        if (validator.transactionIsValid(account.getTransactionAmount())) {

            bankService.deposit(currentSession, account.getTransactionAmount());

        } else {
            return Reply.with(siteMap.transactionError()).error();
        }
        return Reply.with(accountAmount());
    }

    @At("/w/money")
    @Post
    public Reply<?> withdraw(Request request){

        Account account = request.read(Account.class).as(Json.class);
        Session currentSession = currentSessionProvider.get();

        if (validator.transactionIsValid(account.getTransactionAmount())) {

            bankService.withdraw(currentSession, account.getTransactionAmount());

        } else {
            return Reply.with(siteMap.transactionError()).error();
        }
        return Reply.with(accountAmount());
    }

    @Get
    public Reply<?> getUserAccountAmount() {
        return Reply.with(accountAmount());
    }

    private double accountAmount() {
        return bankService.getAccountAmount(currentSessionProvider.get());
    }
}