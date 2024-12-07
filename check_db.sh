#!/bin/bash

echo "Checking Whispered Thoughts Database..."
echo "----------------------------------------"
echo "Recent entries:"
/opt/homebrew/bin/mysql -u root -pJeiwin0612 whispered_thoughts -e "SELECT id, salutation, receiver, relationship, username, DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at FROM thoughts ORDER BY created_at DESC LIMIT 5;"

echo -e "\nTotal number of entries:"
/opt/homebrew/bin/mysql -u root -pJeiwin0612 whispered_thoughts -e "SELECT COUNT(*) as total_entries FROM thoughts;"
