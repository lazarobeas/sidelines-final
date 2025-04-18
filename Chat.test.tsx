import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Chat from './components/Chat';

describe('Chat Component', () => {
  const mockMessages = [
    {
      id: 1,
      message: 'Hello!',
      inserted_at: '2025-04-10T10:00:00Z',
      user: { username: 'user1', display_name: 'User One', avatar_url: null },
    },
    {
      id: 2,
      message: 'Hi there!',
      inserted_at: '2025-04-10T10:01:00Z',
      user: { username: 'user2', display_name: 'User Two', avatar_url: null },
    },
  ];

  const mockSetNewMessage = jest.fn();
  const mockHandleSendMessage = jest.fn();

  it('renders messages correctly', () => {
    render(
      <Chat
        messages={mockMessages}
        newMessage=""
        setNewMessage={mockSetNewMessage}
        handleSendMessage={mockHandleSendMessage}
      />
    );

    // Check if messages are rendered
    expect(screen.getByText('Hello!')).toBeInTheDocument();
    expect(screen.getByText('Hi there!')).toBeInTheDocument();
    expect(screen.getByText('User One')).toBeInTheDocument();
    expect(screen.getByText('User Two')).toBeInTheDocument();
  });

  it('renders placeholder text in the input field', () => {
    render(
      <Chat
        messages={mockMessages}
        newMessage=""
        setNewMessage={mockSetNewMessage}
        handleSendMessage={mockHandleSendMessage}
      />
    );

    // Check if input placeholder is rendered
    expect(screen.getByPlaceholderText('Type Message')).toBeInTheDocument();
  });

  it('calls setNewMessage when typing in the input field', () => {
    render(
      <Chat
        messages={mockMessages}
        newMessage=""
        setNewMessage={mockSetNewMessage}
        handleSendMessage={mockHandleSendMessage}
      />
    );

    const input = screen.getByPlaceholderText('Type Message');
    fireEvent.change(input, { target: { value: 'New message' } });

    // Check if setNewMessage is called with the correct value
    expect(mockSetNewMessage).toHaveBeenCalledWith('New message');
  });

  it('calls handleSendMessage when the form is submitted', () => {
    render(
      <Chat
        messages={mockMessages}
        newMessage="Test message"
        setNewMessage={mockSetNewMessage}
        handleSendMessage={mockHandleSendMessage}
      />
    );

    const form = screen.getByTestId('message-form');
    fireEvent.submit(form);

    // Check if handleSendMessage is called
    expect(mockHandleSendMessage).toHaveBeenCalled();
  });

  it('disables the send button when the input is empty', () => {
    render(
      <Chat
        messages={mockMessages}
        newMessage=""
        setNewMessage={mockSetNewMessage}
        handleSendMessage={mockHandleSendMessage}
      />
    );

    const button = screen.getByTestId('send-button');
    expect(button).toBeDisabled();
  });

  it('enables the send button when the input is not empty', () => {
    render(
      <Chat
        messages={mockMessages}
        newMessage="Test message"
        setNewMessage={mockSetNewMessage}
        handleSendMessage={mockHandleSendMessage}
      />
    );

    const button = screen.getByTestId('send-button');
    expect(button).not.toBeDisabled();
  });
});