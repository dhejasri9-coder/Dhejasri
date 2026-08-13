#include <iostream>
using namespace std;

int main() {
    int choice;

    cout << "=============================\n";
    cout << "       Dheja Mart\n";
    cout << "   Multi-Seller Marketplace\n";
    cout << "=============================\n\n";

    cout << "1. Buyer Login\n";
    cout << "2. Seller Login\n";
    cout << "3. Admin Login\n";
    cout << "4. Exit\n\n";

    cout << "Enter your choice: ";
    cin >> choice;

    switch (choice) {
    case 1: {
    string username, password;

    cout << "\n===== BUYER LOGIN =====\n";

    cout << "Username: ";
    cin >> username;

    cout << "Password: ";
    cin >> password;

    if (username == "buyer" && password == "1234") {
        cout << "\nBuyer Login Successful!\n";
        cout << "Welcome, Buyer!\n";
    } else {
        cout << "\nInvalid username or password.\n";
    }

    break;
    }

    case 2: {
    string username, password;

    cout << "\n===== SELLER LOGIN =====\n";

    cout << "Username: ";
    cin >> username;

    cout << "Password: ";
    cin >> password;

    if (username == "seller" && password == "1234") {
        cout << "\nSeller Login Successful!\n";
        cout << "Welcome, Seller!\n";
    } else {
        cout << "\nInvalid username or password.\n";
    }

    break;
    }

    case 3: {
    string username, password;

    cout << "\n===== SELLER LOGIN =====\n";

    cout << "Username: ";
    cin >> username;

    cout << "Password: ";
    cin >> password;

    if (username == "admin" && password == "1234") {
        cout << "\nAdmin Login Successful!\n";
        cout << "Welcome, Admin!\n";
    } else {
        cout << "\nInvalid username or password.\n";
    }

    break;
    }

        case 4:
            cout << "\nThank you!\n";
            break;

        default:
            cout << "\nInvalid choice.\n";
    }

    return 0;
}