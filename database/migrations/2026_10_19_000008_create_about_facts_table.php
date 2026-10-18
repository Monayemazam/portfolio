<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('about_facts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('about_content_id')
                ->constrained('about_content')
                ->onDelete('cascade');
            $table->enum('kind', ['fact', 'counter'])->default('fact');
            $table->string('label', 100);
            $table->string('value', 100);
            $table->string('suffix', 10)->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['about_content_id', 'kind', 'sort_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('about_facts');
    }
};
